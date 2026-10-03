#!/usr/bin/env ruby
# Project-specific structure checks. Scientific claims require separate review.
require 'yaml'
require 'json'
require 'digest'
require 'time'
require 'pathname'
require 'uri'

root = File.expand_path('..', __dir__)
vault = File.join(root, 'vault')
errors = []
warnings = []
documents = {}
link_count = 0
source_ids = {}

resolve_path = lambda do |value, document|
  path = value.split('#', 2).first
  path = URI::DEFAULT_PARSER.unescape(path)
  path.start_with?('/') ? File.join(vault, path.delete_prefix('/')) : File.expand_path(path, File.dirname(document))
end
local = lambda { |value| !value.match?(/\A[a-z][a-z0-9+.-]*:/i) && !value.start_with?('#') }
check_target = lambda do |value, document, context|
  next unless local.call(value)
  target = resolve_path.call(value, document)
  unless target.start_with?(vault + '/') || target == vault
    errors << "#{document.delete_prefix(vault + '/')}: #{context} escapes vault: #{value}"
    next
  end
  errors << "#{document.delete_prefix(vault + '/')}: missing #{context}: #{value}" unless File.exist?(target)
end
check_time = lambda do |value, context|
  unless value.is_a?(String) && value.match?(/T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})\z/)
    errors << "#{context}: expected ISO datetime with explicit UTC offset"
    next
  end
  begin
    Time.iso8601(value)
  rescue ArgumentError
    errors << "#{context}: invalid datetime"
  end
end

Dir.glob(File.join(vault, '**', '*.md')).sort.each do |file|
  name = file.delete_prefix(vault + '/')
  text = File.read(file, encoding: 'UTF-8')
  match = text.match(/\A---\n(.*?)\n---\n/m)
  meta = nil
  begin
    meta = YAML.safe_load(match[1], permitted_classes: [], aliases: false) if match
  rescue Psych::Exception => e
    errors << "#{name}: invalid YAML: #{e.message}"
  end
  reserved = ['index.md', 'log.md'].include?(File.basename(file))
  if reserved
    if File.basename(file) == 'index.md'
      if file == File.join(vault, 'index.md')
        errors << "#{name}: missing OKF version 0.2" unless meta.is_a?(Hash) && meta['okf_version'] == '0.2'
        errors << "#{name}: unexpected root index metadata" if meta.is_a?(Hash) && meta.keys != ['okf_version']
      elsif match
        errors << "#{name}: nested index must not have frontmatter"
      end
    else
      errors << "#{name}: log must not have frontmatter" if match
      headings = text.scan(/^## (.+)$/).flatten
      errors << "#{name}: missing date-grouped log" if headings.empty?
      headings.each do |date|
        errors << "#{name}: invalid date heading #{date}" unless date.match?(/\A\d{4}-\d{2}-\d{2}\z/)
      end
      errors << "#{name}: dates must be newest first" unless headings == headings.sort.reverse
    end
  else
    unless meta.is_a?(Hash)
      errors << "#{name}: missing frontmatter mapping"
      next
    end
    errors << "#{name}: type must be nonempty string" unless meta['type'].is_a?(String) && !meta['type'].strip.empty?
    %w[title description tags status generated].each do |key|
      errors << "#{name}: missing project field #{key}" unless meta.key?(key)
    end
    errors << "#{name}: invalid lifecycle status" unless %w[draft stable deprecated].include?(meta['status'])
    errors << "#{name}: tags must be a string array" unless meta['tags'].is_a?(Array) && meta['tags'].all? { |tag| tag.is_a?(String) }
    generated = meta['generated']
    if generated.is_a?(Hash) && generated['by'].is_a?(String) && !generated['by'].empty?
      check_time.call(generated['at'], "#{name}: generated.at")
    else
      errors << "#{name}: invalid generated metadata"
    end
    %w[retrieved_at stale_after].each { |key| check_time.call(meta[key], "#{name}: #{key}") if meta.key?(key) }
    sources = meta.fetch('sources', [])
    unless sources.is_a?(Array)
      errors << "#{name}: sources must be an array"
      sources = []
    end
    seen = []
    sources.each do |source|
      unless source.is_a?(Hash) && source['resource'].is_a?(String) && !source['resource'].empty?
        errors << "#{name}: invalid source entry"
        next
      end
      id = source['id']
      errors << "#{name}: duplicate source key #{id}" if id && seen.include?(id)
      seen << id if id
      check_target.call(source['resource'], file, 'source')
    end
    text.scan(/^\[\^([^\]]+)\]:/).flatten.each do |id|
      errors << "#{name}: footnote #{id} has no matching sources.id" unless seen.include?(id)
    end
    if meta['source_id']
      errors << "#{name}: duplicate global source ID" if source_ids.key?(meta['source_id'])
      source_ids[meta['source_id']] = name
    end
    check_target.call(meta['snapshot_of'], file, 'snapshot target') if meta['snapshot_of']
    warnings << "#{name}: no sources metadata" if meta['type'] == 'Evidence Synthesis' && sources.empty?
  end
  documents[name] = meta
  body = match ? text[match.end(0)..-1] : text
  body = body.gsub(/^```[^\n]*\n.*?^```\s*$/m, '')
  body.scan(/!?\[[^\]]*\]\(([^\s)]+)\)/).flatten.each do |target|
    link_count += 1
    check_target.call(target, file, 'link')
  end
end

manifest_path = File.join(vault, 'history', 'immutable-manifest.json')
begin
  manifest = JSON.parse(File.read(manifest_path))
  manifest.fetch('files').each do |name, expected|
    path = File.join(vault, name)
    if !File.file?(path) || Digest::SHA256.file(path).hexdigest != expected
      errors << "immutable file changed or missing: #{name}"
    end
  end
  immutable_paths = Dir.glob(File.join(vault, 'raw', '**', '*')) +
                    Dir.glob(File.join(vault, 'history', 'versions', '*.md')) +
                    Dir.glob(File.join(vault, 'history', 'changes', '*.md'))
  immutable_paths.select { |p| File.file?(p) && File.basename(p) != 'index.md' }.each do |path|
    name = path.delete_prefix(vault + '/')
    errors << "immutable file not registered: #{name}" unless manifest['files'].key?(name)
  end
rescue StandardError => e
  errors << "immutable manifest: #{e.message}"
end
current = documents['wiki/product/prd.md']
errors << 'missing current PRD version' unless current && current['version']
if current && current['version']
  path = File.join(vault, 'history', 'versions', "prd-v#{current['version']}.md")
  errors << 'current PRD has no matching snapshot' unless File.file?(path)
end
capture = JSON.parse(File.read(File.join(vault, 'raw/research/2026-10-03-initial-research.json')))
capture.fetch('sources').each do |source|
  errors << "missing captured source note: #{source['id']}" unless source_ids.key?(source['id'])
end

report = {
  checked_at: Time.now.getlocal('+09:00').iso8601,
  scope: 'Project structure, YAML, local paths, source metadata, initial capture, version availability, immutable file SHA256. Not scientific review or official OKF certification.',
  status: errors.empty? ? 'passed' : 'failed',
  markdown_files: documents.length,
  links_checked: link_count,
  source_notes: source_ids.length,
  immutable_files: manifest ? manifest['files'].length : 0,
  errors: errors,
  warnings: warnings
}
File.write(File.join(vault, 'history', 'validation-latest.json'), JSON.pretty_generate(report) + "\n")
puts JSON.pretty_generate(report)
exit(errors.empty? ? 0 : 1)
