export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Comment Randomizer Backendi API",
    version: "1.0.0",
    description:
      "Autentifikatsiya, kategoriyalar, izohlar, tasodifiy izoh olish va ommaviy nusxalash uchun Express + Prisma server qismi.",
  },
  servers: [
    {
      url: "/api",
      description: "Joriy server",
    },
  ],
  tags: [
    { name: "Holat" },
    { name: "Autentifikatsiya" },
    { name: "Kategoriyalar" },
    { name: "Izohlar" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    },
    schemas: {
      Role: {
        type: "string",
        enum: ["USER", "ADMIN"],
      },
      Sentiment: {
        type: "string",
        enum: ["POSITIVE", "FUNNY", "CRITICAL"],
      },
      User: {
        type: "object",
        required: ["id", "name", "email", "role"],
        properties: {
          id: { type: "string", example: "clx_user_id" },
          name: { type: "string", example: "Admin" },
          email: { type: "string", format: "email", example: "admin@example.com" },
          role: { $ref: "#/components/schemas/Role" },
        },
      },
      AuthResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            required: ["user", "token"],
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: { type: "string", example: "jwt_token" },
            },
          },
          message: { type: "string", example: "" },
        },
      },
      Category: {
        type: "object",
        required: ["id", "name", "slug", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", example: "clx_category_id" },
          name: { type: "string", example: "BeamNG Crash" },
          slug: { type: "string", example: "beamng-crash" },
          description: {
            type: "string",
            nullable: true,
            example: "BeamNG crash video izohlari",
          },
          createdById: {
            type: "string",
            nullable: true,
            example: "clx_user_id",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00.000Z",
          },
        },
      },
      CategoryWithCount: {
        allOf: [
          { $ref: "#/components/schemas/Category" },
          {
            type: "object",
            required: ["commentCount"],
            properties: {
              commentCount: { type: "integer", example: 100000 },
            },
          },
        ],
      },
      Pagination: {
        type: "object",
        required: ["next", "previous", "current_page", "total_pages", "total_items"],
        properties: {
          next: {
            type: "string",
            nullable: true,
            example: "https://api.example.com/api/comments?page=2&pageSize=20",
          },
          previous: { type: "string", nullable: true, example: null },
          current_page: { type: "integer", example: 1 },
          total_pages: { type: "integer", example: 10000 },
          total_items: { type: "integer", example: 200000 },
        },
      },
      CategoryListResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/CategoryWithCount" },
          },
          message: { type: "string", example: "" },
        },
      },
      CategoryResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: { $ref: "#/components/schemas/Category" },
          message: { type: "string", example: "" },
        },
      },
      CategoryWithCountResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: { $ref: "#/components/schemas/CategoryWithCount" },
          message: { type: "string", example: "" },
        },
      },
      CommentCategory: {
        type: "object",
        required: ["id", "name", "slug"],
        properties: {
          id: { type: "string", example: "clx_category_id" },
          name: { type: "string", example: "BeamNG Crash" },
          slug: { type: "string", example: "beamng-crash" },
        },
      },
      Comment: {
        type: "object",
        required: ["id", "text", "sentiment", "category", "createdAt"],
        properties: {
          id: { type: "string", example: "clx_comment_id" },
          text: {
            type: "string",
            example: "Bu o'yin juda zo'r ko'rinyapti",
          },
          sentiment: { $ref: "#/components/schemas/Sentiment" },
          categoryId: { type: "string", example: "clx_category_id" },
          createdById: {
            type: "string",
            nullable: true,
            example: "clx_user_id",
          },
          category: { $ref: "#/components/schemas/CommentCategory" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00.000Z",
          },
        },
      },
      CommentsListResponse: {
        type: "object",
        required: ["status", "data", "message", "pagination"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
          message: { type: "string", example: "" },
          pagination: { $ref: "#/components/schemas/Pagination" },
        },
      },
      CommentResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: { $ref: "#/components/schemas/Comment" },
          message: { type: "string", example: "" },
        },
      },
      BulkCopyResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            required: ["count", "text", "total"],
            properties: {
              count: { type: "integer", example: 1000 },
              text: {
                type: "string",
                example: "izoh 1\nizoh 2\nizoh 3",
              },
              total: { type: "integer", example: 12000 },
            },
          },
          message: { type: "string", example: "" },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "error" },
          data: { type: "object", nullable: true, example: null },
          message: { type: "string", example: "Resurs topilmadi" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        required: ["status", "data", "message", "errors"],
        properties: {
          status: { type: "string", example: "error" },
          data: { type: "object", nullable: true, example: null },
          message: { type: "string", example: "Validatsiyadan o'tmadi" },
          errors: {
            type: "array",
            items: {
              type: "object",
              required: ["field", "message"],
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Email noto'g'ri" },
              },
            },
          },
        },
      },
    },
    requestBodies: {
      RegisterBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", minLength: 2, maxLength: 80, example: "Admin" },
                email: {
                  type: "string",
                  format: "email",
                  example: "admin@example.com",
                },
                password: {
                  type: "string",
                  minLength: 6,
                  maxLength: 100,
                  example: "password123",
                },
              },
            },
          },
        },
      },
      LoginBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "admin@example.com",
                },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      CategoryCreateBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", minLength: 2, maxLength: 80, example: "GTA 6" },
                description: {
                  type: "string",
                  maxLength: 500,
                  example: "GTA 6 video izohlari",
                },
              },
            },
          },
        },
      },
      CategoryUpdateBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              minProperties: 1,
              properties: {
                name: { type: "string", minLength: 2, maxLength: 80, example: "GTA 6" },
                description: {
                  type: "string",
                  nullable: true,
                  maxLength: 500,
                  example: "Yangilangan tavsif",
                },
              },
            },
          },
        },
      },
      CommentCreateBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["categoryId", "text", "sentiment"],
              properties: {
                categoryId: { type: "string", example: "clx_category_id" },
                text: {
                  type: "string",
                  minLength: 1,
                  maxLength: 1000,
                  example: "Bu o'yin juda zo'r ko'rinyapti",
                },
                sentiment: { $ref: "#/components/schemas/Sentiment" },
              },
            },
          },
        },
      },
      CommentUpdateBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              minProperties: 1,
              properties: {
                categoryId: { type: "string", example: "clx_category_id" },
                text: {
                  type: "string",
                  minLength: 1,
                  maxLength: 1000,
                  example: "Yangilangan izoh matni",
                },
                sentiment: { $ref: "#/components/schemas/Sentiment" },
              },
            },
          },
        },
      },
      BulkCopyBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                categoryId: { type: "string", example: "clx_category_id" },
                sentiment: { $ref: "#/components/schemas/Sentiment" },
                limit: {
                  type: "integer",
                  minimum: 1,
                  maximum: 50000,
                  default: 1000,
                  example: 1000,
                },
                random: { type: "boolean", default: true, example: true },
              },
            },
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Validatsiya xatosi",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
          },
        },
      },
      Unauthorized: {
        description: "Token yuborilmagan, noto'g'ri yoki muddati tugagan",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Foydalanuvchida ruxsat yo'q",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Resurs topilmadi",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Holat"],
        summary: "Holatni tekshirish",
        responses: {
          "200": {
            description: "API ishlayapti",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "data", "message"],
                  properties: {
                    status: { type: "string", example: "success" },
                    data: {
                      type: "object",
                      required: ["ok"],
                      properties: {
                        ok: { type: "boolean", example: true },
                      },
                    },
                    message: { type: "string", example: "" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Autentifikatsiya"],
        summary: "Foydalanuvchini ro'yxatdan o'tkazish",
        requestBody: { $ref: "#/components/requestBodies/RegisterBody" },
        responses: {
          "201": {
            description: "Ro'yxatdan o'tgan foydalanuvchi va token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autentifikatsiya"],
        summary: "Foydalanuvchini tizimga kiritish",
        requestBody: { $ref: "#/components/requestBodies/LoginBody" },
        responses: {
          "200": {
            description: "Tizimga kirgan foydalanuvchi va token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Autentifikatsiya"],
        summary: "Joriy foydalanuvchini olish",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Joriy foydalanuvchi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status", "data", "message"],
                  properties: {
                    status: { type: "string", example: "success" },
                    data: { $ref: "#/components/schemas/User" },
                    message: { type: "string", example: "" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Kategoriyalar"],
        summary: "Kategoriyalar ro'yxatini olish",
        responses: {
          "200": {
            description: "Kategoriyalar",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryListResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Kategoriyalar"],
        summary: "Kategoriya yaratish",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CategoryCreateBody" },
        responses: {
          "201": {
            description: "Yaratilgan kategoriya",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Kategoriyalar"],
        summary: "Kategoriyani id bo'yicha olish",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Kategoriya",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryWithCountResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Kategoriyalar"],
        summary: "Kategoriyani yangilash",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { $ref: "#/components/requestBodies/CategoryUpdateBody" },
        responses: {
          "200": {
            description: "Yangilangan kategoriya",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Kategoriyalar"],
        summary: "Kategoriyani o'chirish",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "204": { description: "O'chirildi" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/comments": {
      get: {
        tags: ["Izohlar"],
        summary: "Izohlarni ro'yxatlash, filterlash yoki tasodifiy olish",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 1000, default: 20 },
          },
          { name: "categoryId", in: "query", schema: { type: "string" } },
          { name: "category_id", in: "query", schema: { type: "string" } },
          {
            name: "sentiment",
            in: "query",
            schema: { $ref: "#/components/schemas/Sentiment" },
          },
          { name: "q", in: "query", schema: { type: "string", maxLength: 200 } },
          { name: "random", in: "query", schema: { type: "boolean", default: false } },
        ],
        responses: {
          "200": {
            description: "Izohlar",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentsListResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
      post: {
        tags: ["Izohlar"],
        summary: "Izoh yaratish",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CommentCreateBody" },
        responses: {
          "201": {
            description: "Yaratilgan izoh",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/comments/{id}": {
      get: {
        tags: ["Izohlar"],
        summary: "Izohni id bo'yicha olish",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Izoh",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Izohlar"],
        summary: "Izohni yangilash",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { $ref: "#/components/requestBodies/CommentUpdateBody" },
        responses: {
          "200": {
            description: "Yangilangan izoh",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Izohlar"],
        summary: "Izohni o'chirish",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "204": { description: "O'chirildi" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/comments/bulk-copy": {
      post: {
        tags: ["Izohlar"],
        summary: "Clipboardga nusxalash uchun yangi qator bilan ajratilgan izohlarni olish",
        requestBody: { $ref: "#/components/requestBodies/BulkCopyBody" },
        responses: {
          "200": {
            description: "Ommaviy matn",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BulkCopyResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
  },
} as const;
