import { Prisma, type Comment, type Role, type Sentiment } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { ForbiddenError, NotFoundError } from "../../utils/errors";
import { slugify } from "../../utils/slugify";

interface AuthContext {
  userId: string;
  role: Role;
}

export interface ListCommentsInput {
  page: number;
  pageSize: number;
  categoryId?: string;
  category_id?: string;
  sentiment?: Sentiment;
  q?: string;
  random: boolean;
}

export interface StatsCommentsInput {
  categoryId?: string;
  category_id?: string;
  sentiment?: Sentiment;
  q?: string;
}

interface CommentInput {
  categoryId: string;
  text: string;
  sentiment: Sentiment;
}

interface BulkCopyInput {
  categoryId?: string;
  sentiment?: Sentiment;
  limit: number;
  random: boolean;
}

interface RawCommentRow {
  id: string;
  text: string;
  sentiment: Sentiment;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

const commentInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.CommentInclude;

export async function listComments(input: ListCommentsInput) {
  const categoryId = input.categoryId || input.category_id;
  const where = createWhere({
    categoryId,
    sentiment: input.sentiment,
    q: input.q,
  });

  const total = await prisma.comment.count({ where });
  const items = input.random
    ? await findRandomComments({ categoryId, sentiment: input.sentiment, q: input.q }, input.pageSize)
    : await prisma.comment.findMany({
        where,
        include: commentInclude,
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      });

  return {
    total,
    page: input.page,
    pageSize: input.pageSize,
    totalPages: Math.max(1, Math.ceil(total / input.pageSize)),
    items,
  };
}

export interface ImportRow {
  category?: string;
  text?: string;
  sentiment?: string;
}

export interface ImportResult {
  total_rows: number;
  created_comments: number;
  created_categories: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}

const VALID_SENTIMENTS = new Set<Sentiment>(["POSITIVE", "FUNNY", "CRITICAL"]);

export async function importComments(rows: ImportRow[], auth: AuthContext): Promise<ImportResult> {
  const errors: ImportResult["errors"] = [];
  const valid: Array<{ name: string; slug: string; text: string; sentiment: Sentiment }> = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +1 for header row, +1 for 1-based numbering
    const name = (row.category ?? "").trim();
    const text = (row.text ?? "").trim();
    const sentiment = (row.sentiment ?? "").trim().toUpperCase();

    if (!name) {
      errors.push({ row: rowNumber, message: "category is empty" });
      return;
    }
    if (!text) {
      errors.push({ row: rowNumber, message: "text is empty" });
      return;
    }
    if (!VALID_SENTIMENTS.has(sentiment as Sentiment)) {
      errors.push({
        row: rowNumber,
        message: `invalid sentiment "${row.sentiment ?? ""}" (allowed: POSITIVE, FUNNY, CRITICAL)`,
      });
      return;
    }

    valid.push({ name, slug: slugify(name), text, sentiment: sentiment as Sentiment });
  });

  // Resolve categories by slug, creating any that don't exist yet.
  const slugToName = new Map<string, string>();
  for (const item of valid) {
    if (!slugToName.has(item.slug)) slugToName.set(item.slug, item.name);
  }

  const existing = await prisma.category.findMany({
    where: { slug: { in: [...slugToName.keys()] } },
    select: { id: true, slug: true },
  });
  const slugToId = new Map(existing.map((category) => [category.slug, category.id]));

  let createdCategories = 0;
  for (const [slug, name] of slugToName) {
    if (slugToId.has(slug)) continue;
    const created = await prisma.category.create({
      data: { name, slug, createdById: auth.userId },
      select: { id: true, slug: true },
    });
    slugToId.set(created.slug, created.id);
    createdCategories += 1;
  }

  // Bulk-insert the comments.
  let createdComments = 0;
  if (valid.length) {
    const result = await prisma.comment.createMany({
      data: valid.map((item) => ({
        text: item.text,
        sentiment: item.sentiment,
        categoryId: slugToId.get(item.slug) as string,
        createdById: auth.userId,
      })),
    });
    createdComments = result.count;
  }

  return {
    total_rows: rows.length,
    created_comments: createdComments,
    created_categories: createdCategories,
    skipped: errors.length,
    errors,
  };
}

export async function getCommentStats(input: StatsCommentsInput) {
  const categoryId = input.categoryId || input.category_id;
  const where = createWhere({
    categoryId,
    sentiment: input.sentiment,
    q: input.q,
  });

  const [totalComments, totalCategories] = await Promise.all([
    prisma.comment.count({ where }),
    prisma.category.count(),
  ]);

  return {
    total_comments: totalComments,
    total_categories: totalCategories,
  };
}

export async function getComment(id: string) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: commentInclude,
  });

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  return comment;
}

export async function createComment(input: CommentInput, auth: AuthContext) {
  await ensureCategoryExists(input.categoryId);

  return prisma.comment.create({
    data: {
      categoryId: input.categoryId,
      text: input.text,
      sentiment: input.sentiment,
      createdById: auth.userId,
    },
    include: commentInclude,
  });
}

export async function updateComment(id: string, input: Partial<CommentInput>, auth: AuthContext) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  ensureCanMutateComment(comment, auth);

  if (input.categoryId) {
    await ensureCategoryExists(input.categoryId);
  }

  return prisma.comment.update({
    where: { id },
    data: input,
    include: commentInclude,
  });
}

export async function deleteComment(id: string, auth: AuthContext): Promise<void> {
  const comment = await prisma.comment.findUnique({ where: { id } });
  ensureCanMutateComment(comment, auth);
  await prisma.comment.delete({ where: { id } });
}

export async function bulkCopy(input: BulkCopyInput) {
  const where = createWhere(input);
  const total = await prisma.comment.count({ where });
  const rows = input.random
    ? await findRandomCommentTexts(input, input.limit)
    : await prisma.comment.findMany({
        where,
        select: { text: true },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        take: input.limit,
      });

  return {
    total,
    count: rows.length,
    text: rows.map((row) => row.text).join("\n"),
  };
}

function createWhere(filters: { categoryId?: string; sentiment?: Sentiment; q?: string }) {
  return {
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.sentiment ? { sentiment: filters.sentiment } : {}),
    ...(filters.q
      ? {
          text: {
            contains: filters.q,
            mode: "insensitive" as const,
          },
        }
      : {}),
  } satisfies Prisma.CommentWhereInput;
}

async function ensureCategoryExists(categoryId: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }
}

function ensureCanMutateComment(
  comment: Comment | null,
  auth: AuthContext,
): asserts comment is Comment {
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  if (auth.role === "ADMIN") return;

  if (comment.createdById && comment.createdById === auth.userId) return;

  throw new ForbiddenError("You can only modify comments you created");
}

async function findRandomComments(
  filters: { categoryId?: string; sentiment?: Sentiment; q?: string },
  limit: number,
) {
  const rows = await prisma.$queryRaw<RawCommentRow[]>(createRandomQuery(filters, limit, false));
  return rows;
}

async function findRandomCommentTexts(
  filters: { categoryId?: string; sentiment?: Sentiment },
  limit: number,
) {
  return prisma.$queryRaw<Array<{ text: string }>>(createRandomQuery(filters, limit, true));
}

function createRandomQuery(
  filters: { categoryId?: string; sentiment?: Sentiment; q?: string },
  limit: number,
  textOnly: boolean,
) {
  const whereParts: Prisma.Sql[] = [];

  if (filters.categoryId) {
    whereParts.push(Prisma.sql`c."categoryId" = ${filters.categoryId}`);
  }

  if (filters.sentiment) {
    whereParts.push(Prisma.sql`c."sentiment" = ${filters.sentiment}::"Sentiment"`);
  }

  if (filters.q) {
    whereParts.push(Prisma.sql`c."text" ILIKE ${`%${filters.q}%`}`);
  }

  const whereSql = whereParts.length
    ? Prisma.sql`WHERE ${Prisma.join(whereParts, " AND ")}`
    : Prisma.empty;

  if (textOnly) {
    return Prisma.sql`
      SELECT c."text"
      FROM "Comment" c
      ${whereSql}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;
  }

  return Prisma.sql`
    SELECT
      c."id",
      c."text",
      c."sentiment",
      c."createdAt",
      json_build_object(
        'id', cat."id",
        'name', cat."name",
        'slug', cat."slug"
      ) AS "category"
    FROM "Comment" c
    INNER JOIN "Category" cat ON cat."id" = c."categoryId"
    ${whereSql}
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;
}
