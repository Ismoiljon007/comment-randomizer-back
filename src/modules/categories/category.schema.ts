import { z } from "zod";

export const categoryParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listCategoriesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(1000).default(20),
    q: z.string().trim().max(200).optional(),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().max(500).optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(80).optional(),
      description: z.string().trim().max(500).nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
});
