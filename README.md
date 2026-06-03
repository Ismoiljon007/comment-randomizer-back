# Comment Randomizer Backend

Express.js + Prisma + PostgreSQL backend. Bu project alohida backend root sifatida ishlaydi, ya'ni commandlar shu papkaning o'zida bajariladi.

## Stack

- Express.js
- TypeScript
- Prisma
- PostgreSQL
- JWT auth
- Zod validation

## Project Structure

```txt
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── routes/
│   ├── types/
│   └── utils/
├── .env.example
├── package.json
└── tsconfig.json
```

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
```

`.env` ichidagi `DATABASE_URL` ni o'zingizdagi PostgreSQL databasega moslang:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/comment_randomizer"
JWT_ACCESS_SECRET="change-this-secret"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
WEB_ORIGIN="http://localhost:3000"
COMMENTS_JSON_PATH=""
```

## Database

Database tayyor bo'lgandan keyin migration qiling:

```bash
npm run prisma:migrate -- --name init
```

Production yoki tayyor migrationlarni ishlatish uchun:

```bash
npm run prisma:deploy
```

## Seed

Boshlang'ich commentlarni import qilish uchun `comments.json` kerak.

Variant 1: JSON faylni shu pathga qo'ying:

```txt
src/data/comments.json
```

Variant 2: `.env` ichida absolute path bering:

```env
COMMENTS_JSON_PATH="/Users/ismoiljon/Desktop/untitled folder/comment-randomizer/server/assets/comments.json"
```

Keyin seedni ishga tushiring:

```bash
npm run seed
```

Seed script:

- categorylarni databasega yozadi
- eski numeric `category_id` larni yangi Prisma `Category.id` ga map qiladi
- `positive`, `funny`, `critical` sentimentlarni uppercase enumga o'tkazadi
- commentlarni batch bilan import qiladi

## Development

```bash
npm run dev
```

API default holatda shu URLda ishlaydi:

```txt
http://localhost:4000/api
```

Health check:

```txt
GET /api/health
```

Swagger docs:

```txt
http://localhost:4000/api/docs
```

OpenAPI JSON:

```txt
http://localhost:4000/api/docs.json
```

## Scripts

```bash
npm run dev              # dev server
npm run build            # TypeScript build
npm run start            # dist/src/server.js ni ishga tushiradi
npm run typecheck        # tsc --noEmit
npm run prisma:generate  # Prisma Client generate
npm run prisma:migrate   # Prisma migrate dev
npm run prisma:deploy    # Prisma migrate deploy
npm run seed             # comments.json import
```

## API Endpoints

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Categories

```txt
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

### Comments

```txt
GET    /api/comments
GET    /api/comments/:id
POST   /api/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
POST   /api/comments/bulk-copy
```

Protected endpointlar uchun header:

```txt
Authorization: Bearer <token>
```

## Filtering

```txt
GET /api/comments?page=1&pageSize=20&categoryId=<id>&sentiment=POSITIVE&q=search
GET /api/comments?random=true&pageSize=50
```

`pageSize` max `1000`.

## Bulk Copy

```txt
POST /api/comments/bulk-copy
```

Body:

```json
{
  "categoryId": "category_id",
  "sentiment": "POSITIVE",
  "limit": 1000,
  "random": true
}
```

Response `text` fieldida commentlar newline bilan qaytadi.

## Permissions

- Guest: category/comment list, filter, random, bulk-copy.
- USER: guest permissionlari, category/comment create, o'zi yaratganlarini edit/delete.
- ADMIN: hamma category/commentni edit/delete.

Seed qilingan category/commentlarda owner yo'q, shuning uchun ularni faqat ADMIN edit/delete qila oladi.
# comment-randomizer-back
