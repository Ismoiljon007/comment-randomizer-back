import type { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ForbiddenError, NotFoundError } from "../../utils/errors";
import { slugify } from "../../utils/slugify";

interface AuthContext {
  userId: string;
  role: Role;
}

interface CategoryInput {
  name: string;
  description?: string | null;
}

export interface ListCategoriesInput {
  page: number;
  pageSize: number;
  q?: string;
}

export async function listCategories(input: ListCategoriesInput) {
  const where = input.q
    ? {
        name: {
          contains: input.q,
          mode: "insensitive" as const,
        },
      }
    : {};

  const total = await prisma.category.count({ where });
  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
    skip: (input.page - 1) * input.pageSize,
    take: input.pageSize,
  });

  return {
    total,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
    items: categories.map(({ _count, ...category }) => ({
      ...category,
      commentCount: _count.comments,
    })),
  };
}

export async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const { _count, ...rest } = category;
  return {
    ...rest,
    commentCount: _count.comments,
  };
}

export async function createCategory(input: CategoryInput, auth: AuthContext) {
  const slug = await createUniqueSlug(input.name);

  return prisma.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description || null,
      createdById: auth.userId,
    },
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>, auth: AuthContext) {
  const category = await prisma.category.findUnique({ where: { id } });
  ensureCanMutateCategory(category, auth);

  const slug = input.name ? await createUniqueSlug(input.name, id) : undefined;

  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name, slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    },
  });
}

export async function deleteCategory(id: string, auth: AuthContext): Promise<void> {
  const category = await prisma.category.findUnique({ where: { id } });
  ensureCanMutateCategory(category, auth);
  await prisma.category.delete({ where: { id } });
}

async function createUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

function ensureCanMutateCategory(
  category: { id: string; createdById: string | null } | null,
  auth: AuthContext,
): asserts category is { id: string; createdById: string | null } {
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  if (auth.role === "ADMIN") return;

  if (category.createdById && category.createdById === auth.userId) return;

  throw new ForbiddenError("You can only modify categories you created");
}
