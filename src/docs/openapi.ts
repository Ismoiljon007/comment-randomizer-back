export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Comment Randomizer Backend API",
    version: "1.0.0",
    description:
      "Express + Prisma backend for auth, categories, comments, random comment lookup, and bulk copy.",
  },
  servers: [
    {
      url: "/api",
      description: "Current server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Categories" },
    { name: "Comments" },
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
        required: ["user", "token"],
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string", example: "jwt_token" },
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
            example: "BeamNG crash video comments",
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
      CategoryListResponse: {
        type: "object",
        required: ["categories"],
        properties: {
          categories: {
            type: "array",
            items: { $ref: "#/components/schemas/CategoryWithCount" },
          },
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
            example: "This game looks amazing",
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
        required: ["total", "page", "pageSize", "totalPages", "items"],
        properties: {
          total: { type: "integer", example: 200000 },
          page: { type: "integer", example: 1 },
          pageSize: { type: "integer", example: 20 },
          totalPages: { type: "integer", example: 10000 },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
        },
      },
      BulkCopyResponse: {
        type: "object",
        required: ["total", "count", "text"],
        properties: {
          total: { type: "integer", example: 12000 },
          count: { type: "integer", example: 1000 },
          text: {
            type: "string",
            example: "comment 1\ncomment 2\ncomment 3",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Resource not found" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        required: ["message", "errors"],
        properties: {
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              required: ["field", "message"],
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Invalid email" },
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
                  example: "GTA 6 video comments",
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
                  example: "Updated description",
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
                  example: "This game looks amazing",
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
                  example: "Updated comment text",
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
        description: "Validation error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
          },
        },
      },
      Unauthorized: {
        description: "Missing, invalid, or expired token",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "User does not have permission",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
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
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok"],
                  properties: {
                    ok: { type: "boolean", example: true },
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
        tags: ["Auth"],
        summary: "Register user",
        requestBody: { $ref: "#/components/requestBodies/RegisterBody" },
        responses: {
          "201": {
            description: "Registered user and token",
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
        tags: ["Auth"],
        summary: "Login user",
        requestBody: { $ref: "#/components/requestBodies/LoginBody" },
        responses: {
          "200": {
            description: "Logged in user and token",
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
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["user"],
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
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
        tags: ["Categories"],
        summary: "List categories",
        responses: {
          "200": {
            description: "Categories",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryListResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CategoryCreateBody" },
        responses: {
          "201": {
            description: "Created category",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["category"],
                  properties: {
                    category: { $ref: "#/components/schemas/Category" },
                  },
                },
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
        tags: ["Categories"],
        summary: "Get category by id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Category",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["category"],
                  properties: {
                    category: { $ref: "#/components/schemas/CategoryWithCount" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Categories"],
        summary: "Update category",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { $ref: "#/components/requestBodies/CategoryUpdateBody" },
        responses: {
          "200": {
            description: "Updated category",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["category"],
                  properties: {
                    category: { $ref: "#/components/schemas/Category" },
                  },
                },
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
        tags: ["Categories"],
        summary: "Delete category",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "204": { description: "Deleted" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/comments": {
      get: {
        tags: ["Comments"],
        summary: "List, filter, or randomize comments",
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
            description: "Comments",
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
        tags: ["Comments"],
        summary: "Create comment",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CommentCreateBody" },
        responses: {
          "201": {
            description: "Created comment",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["comment"],
                  properties: {
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
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
        tags: ["Comments"],
        summary: "Get comment by id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Comment",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["comment"],
                  properties: {
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Comments"],
        summary: "Update comment",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { $ref: "#/components/requestBodies/CommentUpdateBody" },
        responses: {
          "200": {
            description: "Updated comment",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["comment"],
                  properties: {
                    comment: { $ref: "#/components/schemas/Comment" },
                  },
                },
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
        tags: ["Comments"],
        summary: "Delete comment",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "204": { description: "Deleted" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/comments/bulk-copy": {
      post: {
        tags: ["Comments"],
        summary: "Get newline-separated comments for clipboard copy",
        requestBody: { $ref: "#/components/requestBodies/BulkCopyBody" },
        responses: {
          "200": {
            description: "Bulk text",
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
