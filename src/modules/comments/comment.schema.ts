import { z } from "zod";

const sentimentSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.toUpperCase() : value),
  z.enum(["POSITIVE", "FUNNY", "CRITICAL"]),
);

const optionalSentimentSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    return typeof value === "string" ? value.toUpperCase() : value;
  },
  z.enum(["POSITIVE", "FUNNY", "CRITICAL"]).optional(),
);

const randomQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return false;
  return value === true || value === "true";
}, z.boolean());

export const commentParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listCommentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(1000).default(20),
    categoryId: z.string().min(1).optional(),
    category_id: z.string().min(1).optional(),
    sentiment: optionalSentimentSchema,
    q: z.string().trim().max(200).optional(),
    random: randomQuerySchema,
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1),
    text: z.string().trim().min(1).max(1000),
    sentiment: sentimentSchema,
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      categoryId: z.string().min(1).optional(),
      text: z.string().trim().min(1).max(1000).optional(),
      sentiment: sentimentSchema.optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

export const bulkCopySchema = z.object({
  body: z.object({
    categoryId: z.string().min(1).optional(),
    sentiment: optionalSentimentSchema,
    limit: z.coerce.number().int().min(1).max(50000).default(1000),
    random: z.boolean().default(true),
  }),
});
