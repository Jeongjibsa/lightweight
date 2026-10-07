import { z } from "zod";
import { catalog } from "./catalog";
import { guideId, payloadSchema } from "./guide-schema";

const publishedGuideSchema = payloadSchema.extend({ reviewVersion: guideId });
export const publishedGuidesSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    registryVersion: guideId,
    exercises: z.array(publishedGuideSchema),
  })
  .superRefine((bundle, context) => {
    const seen = new Set<string>();
    for (const guide of bundle.exercises) {
      const sourceIds = guide.sources.map((s) => s.id);
      if (
        seen.has(guide.exerciseId) ||
        !catalog.some((e) => e.id === guide.exerciseId) ||
        new Set(sourceIds).size !== sourceIds.length ||
        new Set(guide.claims.map((c) => c.id)).size !== guide.claims.length ||
        guide.sources.some((s) => s.readScope !== "full_review") ||
        guide.assets.some((a) => a.license === "unknown") ||
        guide.claims.some((c) =>
          c.sourceIds.some((id) => !sourceIds.includes(id)),
        )
      )
        context.addIssue({
          code: "custom",
          message: "Invalid published guide contract",
        });
      seen.add(guide.exerciseId);
    }
  });
export type PublishedGuide = z.infer<typeof publishedGuideSchema>;

export async function loadPublishedGuides(signal?: AbortSignal) {
  const response = await fetch("/content/exercise-guides.json", {
    signal,
    credentials: "omit",
  });
  if (!response.ok) throw new Error("Guide unavailable");
  return publishedGuidesSchema.parse(await response.json());
}
