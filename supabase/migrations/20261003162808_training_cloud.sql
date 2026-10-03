-- Manual, account-scoped snapshots. No automatic transfer of local profiles.
create schema if not exists training_private;
create extension if not exists pg_jsonschema with schema extensions;
revoke all on schema training_private from public, anon, authenticated;
grant usage on schema training_private to authenticated;
alter default privileges in schema training_private revoke execute on functions from public;

create table training_private.members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
create table training_private.workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  revision bigint not null check (revision > 0 and revision < 9007199254740991),
  snapshot jsonb not null,
  updated_at timestamptz not null default now()
);
create table training_private.operations (
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  request_hash bytea not null,
  expected_revision bigint not null check (expected_revision >= 0),
  result_revision bigint not null check (result_revision > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, operation_id)
);
alter table training_private.members enable row level security;
alter table training_private.members force row level security;
alter table training_private.workspaces enable row level security;
alter table training_private.workspaces force row level security;
alter table training_private.operations enable row level security;
alter table training_private.operations force row level security;
create policy own_membership on training_private.members for select to authenticated using ((select auth.uid()) = user_id);
create policy own_workspace on training_private.workspaces for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy own_operations on training_private.operations for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on all tables in schema training_private from public, anon, authenticated;

create function training_private.valid_preferences(p jsonb) returns boolean
language sql immutable security invoker set search_path = '' as $$
  select p = 'null'::jsonb or (
    (p->>'weeklyMin')::integer <= (p->>'weeklyMax')::integer
    and (p->>'goal' <> 'custom' or length(trim(p->>'customGoal')) > 0)
    and (p->>'split' <> 'custom' or length(trim(p->>'customSplit')) > 0)
  );
$$;
create function training_private.valid_snapshot(p jsonb, owner uuid) returns boolean
language plpgsql stable security invoker set search_path = '' as $$
declare r jsonb; s jsonb; t jsonb;
begin
  if p is null or octet_length(p::text) > 10485760 or not extensions.jsonb_matches_schema($schema${"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"format":{"type":"string","const":"lightweight-backup"},"version":{"type":"number","const":1},"exportedAt":{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},"profile":{"type":"object","properties":{"ownerId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"name":{"type":"string","minLength":1,"maxLength":40},"preferences":{"anyOf":[{"type":"object","properties":{"goal":{"type":"string","enum":["hypertrophy","strength","consistency","custom"]},"customGoal":{"type":"string","maxLength":100},"weeklyMin":{"type":"integer","minimum":1,"maximum":7},"weeklyMax":{"type":"integer","minimum":1,"maximum":7},"split":{"type":"string","enum":["full_body","two_way","three_way","four_way","five_way","custom"]},"customSplit":{"type":"string","maxLength":100},"minutes":{"anyOf":[{"type":"integer","minimum":10,"maximum":240},{"type":"null"}]},"equipment":{"maxItems":5,"type":"array","items":{"type":"string","enum":["덤벨","바벨","머신","케이블","맨몸"]}}},"required":["goal","customGoal","weeklyMin","weeklyMax","split","customSplit","minutes","equipment"],"additionalProperties":false},{"type":"null"}]},"unit":{"type":"string","enum":["kg","lb"]},"timeZone":{"type":"string","maxLength":100},"revision":{"type":"integer","minimum":1,"maximum":9007199254740991},"updatedAt":{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"}},"required":["ownerId","name","preferences","unit","timeZone","revision","updatedAt"],"additionalProperties":false},"routines":{"maxItems":500,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"ownerId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"revision":{"type":"integer","minimum":1,"maximum":9007199254740991},"updatedAt":{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},"deletedAt":{"anyOf":[{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},{"type":"null"}]},"name":{"type":"string","minLength":1,"maxLength":80},"exercises":{"minItems":1,"maxItems":30,"type":"array","items":{"type":"object","properties":{"exercise":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":100},"name":{"type":"string","minLength":1,"maxLength":80},"group":{"type":"string","enum":["가슴","등","어깨","팔","하체","코어"]},"equipment":{"type":"string","maxLength":80},"loadMode":{"type":"string","enum":["total","per_hand","machine","bodyweight","assisted","timed"]},"review":{"type":"string","enum":["catalog_draft","user_added"]}},"required":["id","name","group","equipment","loadMode","review"],"additionalProperties":false},"sets":{"type":"integer","minimum":1,"maximum":12}},"required":["exercise","sets"],"additionalProperties":false}},"preferencesSnapshot":{"anyOf":[{"type":"object","properties":{"goal":{"type":"string","enum":["hypertrophy","strength","consistency","custom"]},"customGoal":{"type":"string","maxLength":100},"weeklyMin":{"type":"integer","minimum":1,"maximum":7},"weeklyMax":{"type":"integer","minimum":1,"maximum":7},"split":{"type":"string","enum":["full_body","two_way","three_way","four_way","five_way","custom"]},"customSplit":{"type":"string","maxLength":100},"minutes":{"anyOf":[{"type":"integer","minimum":10,"maximum":240},{"type":"null"}]},"equipment":{"maxItems":5,"type":"array","items":{"type":"string","enum":["덤벨","바벨","머신","케이블","맨몸"]}}},"required":["goal","customGoal","weeklyMin","weeklyMax","split","customSplit","minutes","equipment"],"additionalProperties":false},{"type":"null"}]}},"required":["id","ownerId","revision","updatedAt","deletedAt","name","exercises","preferencesSnapshot"],"additionalProperties":false}},"sessions":{"maxItems":10000,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"ownerId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"revision":{"type":"integer","minimum":1,"maximum":9007199254740991},"updatedAt":{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},"deletedAt":{"anyOf":[{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},{"type":"null"}]},"name":{"type":"string","maxLength":80},"localDate":{"type":"string","format":"date","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))$"},"timeZone":{"type":"string","maxLength":100},"startedAt":{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},"endedAt":{"anyOf":[{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},{"type":"null"}]},"status":{"type":"string","enum":["active","complete","partial","cancelled"]},"routineSnapshot":{"anyOf":[{"type":"object","properties":{"id":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"ownerId":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"revision":{"type":"integer","minimum":1,"maximum":9007199254740991},"updatedAt":{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},"deletedAt":{"anyOf":[{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},{"type":"null"}]},"name":{"type":"string","minLength":1,"maxLength":80},"exercises":{"minItems":1,"maxItems":30,"type":"array","items":{"type":"object","properties":{"exercise":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":100},"name":{"type":"string","minLength":1,"maxLength":80},"group":{"type":"string","enum":["가슴","등","어깨","팔","하체","코어"]},"equipment":{"type":"string","maxLength":80},"loadMode":{"type":"string","enum":["total","per_hand","machine","bodyweight","assisted","timed"]},"review":{"type":"string","enum":["catalog_draft","user_added"]}},"required":["id","name","group","equipment","loadMode","review"],"additionalProperties":false},"sets":{"type":"integer","minimum":1,"maximum":12}},"required":["exercise","sets"],"additionalProperties":false}},"preferencesSnapshot":{"anyOf":[{"type":"object","properties":{"goal":{"type":"string","enum":["hypertrophy","strength","consistency","custom"]},"customGoal":{"type":"string","maxLength":100},"weeklyMin":{"type":"integer","minimum":1,"maximum":7},"weeklyMax":{"type":"integer","minimum":1,"maximum":7},"split":{"type":"string","enum":["full_body","two_way","three_way","four_way","five_way","custom"]},"customSplit":{"type":"string","maxLength":100},"minutes":{"anyOf":[{"type":"integer","minimum":10,"maximum":240},{"type":"null"}]},"equipment":{"maxItems":5,"type":"array","items":{"type":"string","enum":["덤벨","바벨","머신","케이블","맨몸"]}}},"required":["goal","customGoal","weeklyMin","weeklyMax","split","customSplit","minutes","equipment"],"additionalProperties":false},{"type":"null"}]}},"required":["id","ownerId","revision","updatedAt","deletedAt","name","exercises","preferencesSnapshot"],"additionalProperties":false},{"type":"null"}]},"preferencesSnapshot":{"anyOf":[{"type":"object","properties":{"goal":{"type":"string","enum":["hypertrophy","strength","consistency","custom"]},"customGoal":{"type":"string","maxLength":100},"weeklyMin":{"type":"integer","minimum":1,"maximum":7},"weeklyMax":{"type":"integer","minimum":1,"maximum":7},"split":{"type":"string","enum":["full_body","two_way","three_way","four_way","five_way","custom"]},"customSplit":{"type":"string","maxLength":100},"minutes":{"anyOf":[{"type":"integer","minimum":10,"maximum":240},{"type":"null"}]},"equipment":{"maxItems":5,"type":"array","items":{"type":"string","enum":["덤벨","바벨","머신","케이블","맨몸"]}}},"required":["goal","customGoal","weeklyMin","weeklyMax","split","customSplit","minutes","equipment"],"additionalProperties":false},{"type":"null"}]},"sets":{"maxItems":400,"type":"array","items":{"type":"object","properties":{"id":{"type":"string","format":"uuid","pattern":"^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$"},"exercise":{"type":"object","properties":{"id":{"type":"string","minLength":1,"maxLength":100},"name":{"type":"string","minLength":1,"maxLength":80},"group":{"type":"string","enum":["가슴","등","어깨","팔","하체","코어"]},"equipment":{"type":"string","maxLength":80},"loadMode":{"type":"string","enum":["total","per_hand","machine","bodyweight","assisted","timed"]},"review":{"type":"string","enum":["catalog_draft","user_added"]}},"required":["id","name","group","equipment","loadMode","review"],"additionalProperties":false},"order":{"type":"integer","minimum":0,"maximum":9007199254740991},"unit":{"type":"string","enum":["kg","lb"]},"load":{"anyOf":[{"type":"number","minimum":0,"maximum":3000},{"type":"null"}]},"reps":{"anyOf":[{"type":"integer","minimum":1,"maximum":1000},{"type":"null"}]},"seconds":{"anyOf":[{"type":"integer","minimum":1,"maximum":86400},{"type":"null"}]},"kind":{"type":"string","enum":["working","warmup"]},"side":{"type":"string","enum":["both","left","right"]},"rir":{"anyOf":[{"type":"number","minimum":0,"maximum":10},{"type":"null"}]},"completedAt":{"anyOf":[{"type":"string","format":"date-time","pattern":"^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?(?:Z))$"},{"type":"null"}]}},"required":["id","exercise","order","unit","load","reps","seconds","kind","side","rir","completedAt"],"additionalProperties":false}}},"required":["id","ownerId","revision","updatedAt","deletedAt","name","localDate","timeZone","startedAt","endedAt","status","routineSnapshot","preferencesSnapshot","sets"],"additionalProperties":false}}},"required":["format","version","exportedAt","profile","routines","sessions"],"additionalProperties":false}$schema$::json, p) then return false; end if;
  if (p->'profile'->>'ownerId')::uuid <> owner or not training_private.valid_preferences(p->'profile'->'preferences') then return false; end if;
  if not exists(select 1 from pg_catalog.pg_timezone_names where name = p->'profile'->>'timeZone') then return false; end if;
  if (select count(*) <> count(distinct x->>'id') from jsonb_array_elements(p->'routines') x)
    or (select count(*) <> count(distinct x->>'id') from jsonb_array_elements(p->'sessions') x)
    or (select count(*) > 1 from jsonb_array_elements(p->'sessions') x where x->>'status'='active' and x->'deletedAt'='null'::jsonb) then return false; end if;
  for r in select value from jsonb_array_elements(p->'routines') loop
    if (r->>'ownerId')::uuid <> owner or not training_private.valid_preferences(r->'preferencesSnapshot') then return false; end if;
  end loop;
  for s in select value from jsonb_array_elements(p->'sessions') loop
    if (s->>'ownerId')::uuid <> owner or not training_private.valid_preferences(s->'preferencesSnapshot') then return false; end if;
    if not exists(select 1 from pg_catalog.pg_timezone_names where name=s->>'timeZone') then return false; end if;
    if s->'routineSnapshot' <> 'null'::jsonb then
      if (s->'routineSnapshot'->>'ownerId')::uuid <> owner or not training_private.valid_preferences(s->'routineSnapshot'->'preferencesSnapshot') then return false; end if;
    end if;
    if s->>'status'='active' and s->'endedAt'<>'null'::jsonb then return false; end if;
    if s->>'status' in ('complete','partial') and s->'endedAt'='null'::jsonb then return false; end if;
    if s->'endedAt'<>'null'::jsonb and (s->>'endedAt')::timestamptz < (s->>'startedAt')::timestamptz then return false; end if;
    if (select count(*) <> count(distinct x->>'id') from jsonb_array_elements(s->'sets') x) then return false; end if;
    for t in select value from jsonb_array_elements(s->'sets') loop
      if t->'completedAt'<>'null'::jsonb then
        if t->'exercise'->>'loadMode'='timed' then
          if t->'seconds'='null'::jsonb then return false; end if;
        elsif t->'reps'='null'::jsonb or (t->'load'='null'::jsonb and t->'exercise'->>'loadMode'<>'bodyweight') then return false;
        end if;
      end if;
    end loop;
  end loop;
  return true;
exception when invalid_text_representation or datetime_field_overflow then return false;
end;
$$;
alter table training_private.workspaces add constraint valid_snapshot check (training_private.valid_snapshot(snapshot, user_id));

-- Privileged access is kept in an unexposed schema with explicit UID/membership checks.
create function training_private.authorized_owner() returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare owner uuid := auth.uid();
begin
  if owner is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false)
    or not exists(select 1 from training_private.members m where m.user_id=owner and m.enabled) then
    raise exception using errcode='42501', message='Training account is not allowed';
  end if;
  return owner;
end;
$$;
create function training_private.read_snapshot() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare owner uuid := training_private.authorized_owner(); w training_private.workspaces;
begin
  select * into w from training_private.workspaces where user_id=owner;
  return jsonb_build_object('revision',coalesce(w.revision,0),'snapshot',w.snapshot,'updatedAt',w.updated_at);
end;
$$;
create function training_private.write_snapshot(p_operation_id uuid, p_expected_revision bigint, p_snapshot jsonb) returns jsonb
language plpgsql volatile security definer set search_path = '' set statement_timeout = '10s' as $$
declare owner uuid := training_private.authorized_owner(); old training_private.operations; current_revision bigint; request_hash bytea;
begin
  -- Serializes writes for this account, including the first insert, and honors revocation.
  perform 1 from training_private.members where user_id=owner and enabled for update;
  if not found then raise exception using errcode='42501',message='Training account is not allowed'; end if;
  if p_operation_id is null or p_expected_revision is null or p_expected_revision < 0 or p_expected_revision >= 9007199254740990
    or not training_private.valid_snapshot(p_snapshot,owner) then
    raise exception using errcode='22023',message='Invalid training snapshot';
  end if;
  request_hash := sha256(convert_to(p_snapshot::text,'UTF8'));
  select * into old from training_private.operations where user_id=owner and operation_id=p_operation_id;
  if found then
    if old.request_hash<>request_hash or old.expected_revision<>p_expected_revision then
      raise exception using errcode='22023',message='Operation cannot be reused with different input';
    end if;
    return jsonb_build_object('status','saved','revision',old.result_revision);
  end if;
  select revision into current_revision from training_private.workspaces where user_id=owner;
  current_revision := coalesce(current_revision,0);
  if current_revision<>p_expected_revision then
    return jsonb_build_object('status','conflict','revision',current_revision);
  end if;
  insert into training_private.workspaces(user_id,revision,snapshot) values(owner,current_revision+1,p_snapshot)
    on conflict(user_id) do update set revision=excluded.revision,snapshot=excluded.snapshot,updated_at=now();
  insert into training_private.operations(user_id,operation_id,request_hash,expected_revision,result_revision)
    values(owner,p_operation_id,request_hash,p_expected_revision,current_revision+1);
  return jsonb_build_object('status','saved','revision',current_revision+1);
end;
$$;
create function public.training_snapshot_read() returns jsonb
language sql stable security invoker set search_path = '' as $$ select training_private.read_snapshot(); $$;
create function public.training_snapshot_write(p_operation_id uuid,p_expected_revision bigint,p_snapshot jsonb) returns jsonb
language sql volatile security invoker set search_path = '' as $$ select training_private.write_snapshot(p_operation_id,p_expected_revision,p_snapshot); $$;
revoke all on all functions in schema training_private from public, anon, authenticated;
revoke all on function public.training_snapshot_read() from public, anon, authenticated;
revoke all on function public.training_snapshot_write(uuid,bigint,jsonb) from public, anon, authenticated;
grant execute on function training_private.read_snapshot(), training_private.write_snapshot(uuid,bigint,jsonb) to authenticated;
grant execute on function public.training_snapshot_read(), public.training_snapshot_write(uuid,bigint,jsonb) to authenticated;
-- Supabase's default event-trigger helper is not an application RPC.
do $$ begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
notify pgrst, 'reload schema';
