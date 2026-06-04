import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { Sentiment } from "@prisma/client";
import { prisma } from "../src/config/prisma";
import { env } from "../src/config/env";
import { slugify } from "../src/utils/slugify";

interface RawCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

interface RawComment {
  id: number;
  category_id: number;
  comment: string;
  sentiment: string;
}

interface RawDataset {
  categories: RawCategory[];
  comments: RawComment[];
}

const batchSize = 5000;

async function main(): Promise<void> {
  const dataPath = await resolveCommentsPath();
  console.log(`Izohlar ma'lumoti ${dataPath} faylidan o'qilmoqda`);

  const raw = await readFile(dataPath, "utf8");
  const dataset = JSON.parse(raw) as RawDataset;

  if (!Array.isArray(dataset.categories) || !Array.isArray(dataset.comments)) {
    throw new Error("comments.json ichida categories va comments arraylari bo'lishi kerak");
  }

  const categoryIdMap = new Map<number, string>();

  for (const category of dataset.categories) {
    const slug = slugify(category.slug || category.name);
    const saved = await prisma.category.upsert({
      where: { slug },
      update: {
        name: category.name,
        description: category.description || null,
      },
      create: {
        name: category.name,
        slug,
        description: category.description || null,
      },
    });

    categoryIdMap.set(category.id, saved.id);
  }

  const seededCategoryIds = Array.from(categoryIdMap.values());
  await prisma.comment.deleteMany({
    where: {
      createdById: null,
      categoryId: { in: seededCategoryIds },
    },
  });

  let inserted = 0;
  let skipped = 0;

  for (let start = 0; start < dataset.comments.length; start += batchSize) {
    const batch = dataset.comments.slice(start, start + batchSize);
    const data = batch.flatMap((comment) => {
      const categoryId = categoryIdMap.get(comment.category_id);
      const sentiment = toSentiment(comment.sentiment);

      if (!categoryId || !sentiment || !comment.comment) {
        skipped += 1;
        return [];
      }

      return {
        categoryId,
        text: comment.comment,
        sentiment,
      };
    });

    if (data.length) {
      const result = await prisma.comment.createMany({ data });
      inserted += result.count;
    }

    console.log(`Seed qilindi: ${Math.min(start + batchSize, dataset.comments.length)} / ${dataset.comments.length}`);
  }

  console.log(`Seed tugadi. ${inserted} ta izoh yozildi. ${skipped} tasi o'tkazib yuborildi.`);
}

async function resolveCommentsPath(): Promise<string> {
  const candidates = [
    env.COMMENTS_JSON_PATH,
    path.resolve(process.cwd(), "src/data/comments.json"),
    path.resolve(process.cwd(), "../server/assets/comments.json"),
    path.resolve(process.cwd(), "server/assets/comments.json"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Keyingi variantni tekshiramiz.
    }
  }

  throw new Error(
    `comments.json topilmadi. Tekshirilgan yo'llar: ${candidates.join(", ")}`,
  );
}

function toSentiment(value: string): Sentiment | null {
  const normalized = value.toUpperCase();
  if (normalized === "POSITIVE") return Sentiment.POSITIVE;
  if (normalized === "FUNNY") return Sentiment.FUNNY;
  if (normalized === "CRITICAL") return Sentiment.CRITICAL;
  return null;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
