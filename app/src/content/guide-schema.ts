import { z } from "zod";

export const guideId = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/);
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "Public source must be an HTTPS URL without credentials");
export const payloadSchema = z.strictObject({
  exerciseId: guideId,
  version: guideId,
  claims: z
    .array(
      z.strictObject({
        id: guideId,
        kind: z.enum(["scientific", "biomechanical_inference", "user_fit"]),
        text: z.string().trim().min(1),
        limits: z.string().trim().min(1),
        sourceIds: z.array(guideId).min(1),
      }),
    )
    .min(1),
  sources: z
    .array(
      z.strictObject({
        id: guideId,
        url: httpsUrl,
        readScope: z.enum(["full_review", "partial", "abstract"]),
      }),
    )
    .min(1),
  assets: z.array(
    z.strictObject({
      path: z
        .string()
        .regex(/^\/content\/assets\/[a-zA-Z0-9_-]+\.(?:svg|png|webp|mp4|glb)$/),
      license: z.enum(["own", "licensed", "public_domain", "unknown"]),
      attribution: z.string().trim().min(1),
      rightsRef: guideId,
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
    }),
  ),
});
