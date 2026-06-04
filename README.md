# Comment Randomizer Backendi

Express.js, Prisma va PostgreSQL asosidagi server qismi. Bu loyiha server qismining alohida ildiz papkasi sifatida ishlaydi, ya'ni buyruqlar shu papkaning o'zida bajariladi.

## Texnologiyalar

- Express.js
- TypeScript
- Prisma
- PostgreSQL
- JWT autentifikatsiyasi
- Zod validatsiyasi

## Loyiha Tuzilishi

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

## Sozlash

```bash
npm install
cp .env.example .env
npm run prisma:generate
```

`.env` ichidagi `DATABASE_URL` qiymatini o'zingizdagi PostgreSQL ma'lumotlar bazasiga moslang:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/comment_randomizer"
JWT_ACCESS_SECRET="change-this-secret"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="development"
WEB_ORIGIN="http://localhost:3000"
CORS_ORIGINS=""
COMMENTS_JSON_PATH=""
```

`WEB_ORIGIN` frontend domeni uchun ishlatiladi. Bir nechta frontend domen bo'lsa, `CORS_ORIGINS` ichida vergul bilan ajratib kiriting:

```env
CORS_ORIGINS="https://frontend-domain.vercel.app,https://admin-domain.vercel.app"
```

Vercel deployda `JWT_ACCESS_SECRET` albatta Environment Variables ichida bo'lishi kerak. Aks holda auth endpointlar ishlamaydi.

## Ma'lumotlar Bazasi

Ma'lumotlar bazasi tayyor bo'lgandan keyin migratsiyani ishga tushiring:

```bash
npm run prisma:migrate -- --name init
```

Ishlab chiqarish muhiti yoki tayyor migratsiyalarni ishlatish uchun:

```bash
npm run prisma:deploy
```

## Boshlang'ich Ma'lumotlar

Boshlang'ich izohlarni import qilish uchun `comments.json` kerak.

1-variant: JSON faylni shu yo'lga qo'ying:

```txt
src/data/comments.json
```

2-variant: `comments.json` boshqa joyda bo'lsa, `.env` ichidagi `COMMENTS_JSON_PATH` qiymatiga shu fayl manzilini kiriting.

Keyin boshlang'ich ma'lumotlarni yuklashni ishga tushiring:

```bash
npm run seed
```

Boshlang'ich ma'lumotlarni yuklash skripti:

- kategoriyalarni ma'lumotlar bazasiga yozadi
- eski raqamli `category_id` qiymatlarini yangi Prisma `Category.id` qiymatlariga bog'laydi
- `positive`, `funny`, `critical` sentimentlarini katta harfli enum qiymatlariga o'tkazadi
- izohlarni to'plam-to'plam qilib import qiladi

## Dasturlash Rejimi

```bash
npm run dev
```

API standart holatda shu URLda ishlaydi:

```txt
http://localhost:4000/api
```

Holat tekshiruvi:

```txt
GET /api/health
```

Swagger hujjatlari:

```txt
http://localhost:4000/api/docs
```

Swagger JSON:

```txt
http://localhost:4000/api/docs.json
```

## Skriptlar

```bash
npm run dev              # dasturlash serveri
npm run build            # TypeScript build jarayoni
npm run start            # dist/src/server.js ni ishga tushiradi
npm run typecheck        # tsc --noEmit
npm run prisma:generate  # Prisma Client generatsiyasi
npm run prisma:migrate   # Prisma dasturlash muhiti migratsiyasi
npm run prisma:deploy    # Prisma deploy migratsiyasi
npm run seed             # comments.json importi
```

## API Endpointlari

### Autentifikatsiya

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Kategoriyalar

```txt
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

### Izohlar

```txt
GET    /api/comments
GET    /api/comments/:id
POST   /api/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
POST   /api/comments/bulk-copy
```

Himoyalangan endpointlar uchun header:

```txt
Authorization: Bearer <token>
```

## Filterlash

```txt
GET /api/comments?page=1&pageSize=20&categoryId=<id>&sentiment=POSITIVE&q=search
GET /api/comments?random=true&pageSize=50
```

`pageSize` maksimal `1000`.

## Ommaviy Nusxalash

```txt
POST /api/comments/bulk-copy
```

So'rov tanasi:

```json
{
  "categoryId": "category_id",
  "sentiment": "POSITIVE",
  "limit": 1000,
  "random": true
}
```

Javobning `text` maydonida izohlar yangi qator bilan ajratilgan holda qaytadi.

## Ruxsatlar

- Mehmon: kategoriya/izoh ro'yxati, filtrlash, tasodifiy olish va ommaviy nusxalash.
- USER: mehmon ruxsatlari, kategoriya/izoh yaratish, o'zi yaratganlarini tahrirlash/o'chirish.
- ADMIN: hamma kategoriya/izohlarni tahrirlash/o'chirish.

Seed qilingan kategoriya/izohlarda egasi yo'q, shuning uchun ularni faqat ADMIN tahrirlashi/o'chirishi mumkin.
