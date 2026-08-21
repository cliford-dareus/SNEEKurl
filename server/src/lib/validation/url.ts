import { z } from "zod";

/**
 * Basic URL validation + optional custom backhalf rules.
 */
export const createShortSchema = z.object({
  longUrl: z
    .string({ required_error: "Enter a long URL" })
    .trim()
    .url({ message: "Please enter a valid URL (include http:// or https://)" })
    .refine(
      (val) => {
        try {
          const u = new URL(val);
          return u.protocol === "http:" || u.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Only http and https URLs are allowed" }
    ),
  backhalf: z
    .string()
    .trim()
    .min(3, "Custom backhalf must be at least 3 characters")
    .max(32, "Custom backhalf must be at most 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Backhalf can only contain letters, numbers, hyphens, and underscores"
    )
    .optional()
    .or(z.literal("").transform(() => undefined)),
  password: z
    .string()
    .min(4, "Link password must be at least 4 characters")
    .max(64, "Link password must be at most 64 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const editShortSchema = z.object({
  id: z.string().min(1, "Link id is required"),
  longUrl: z
    .string()
    .trim()
    .url({ message: "Please enter a valid URL" })
    .optional(),
  shortUrl: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  isShareable: z.boolean().optional(),
  password: z
    .string()
    .min(4, "Link password must be at least 4 characters")
    .max(64)
    .optional()
    .nullable(),
});

export type CreateShortInput = z.infer<typeof createShortSchema>;
export type EditShortInput = z.infer<typeof editShortSchema>;
