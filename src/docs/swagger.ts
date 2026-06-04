export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Comment Randomizer Backend API",
    version: "1.0.0",
    description:
      "Express + Prisma backend for authentication, categories, comments, random comment retrieval, and bulk copy.",
  },
  servers: [
    {
      url: "/api",
      description: "Current server",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Authentication" },
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
        required: ["status", "data", "message", "pagination"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/CategoryWithCount" },
          },
          message: { type: "string", example: "" },
          pagination: { $ref: "#/components/schemas/Pagination" },
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
            example: "This game looks awesome",
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
      CommentStatsResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            required: ["total_comments", "total_categories"],
            properties: {
              total_comments: { type: "integer", example: 144 },
              total_categories: { type: "integer", example: 12 },
            },
          },
          message: { type: "string", example: "" },
        },
      },
      CommentUploadResponse: {
        type: "object",
        required: ["status", "data", "message"],
        properties: {
          status: { type: "string", example: "success" },
          data: {
            type: "object",
            required: [
              "total_rows",
              "created_comments",
              "created_categories",
              "skipped",
              "errors",
            ],
            properties: {
              total_rows: { type: "integer", example: 100 },
              created_comments: { type: "integer", example: 98 },
              created_categories: { type: "integer", example: 3 },
              skipped: { type: "integer", example: 2 },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  required: ["row", "message"],
                  properties: {
                    row: { type: "integer", example: 5 },
                    message: {
                      type: "string",
                      example: "invalid sentiment \"GOOD\" (allowed: POSITIVE, FUNNY, CRITICAL)",
                    },
                  },
                },
              },
            },
          },
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
                example: "comment 1\ncomment 2\ncomment 3",
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
          message: { type: "string", example: "Resource not found" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        required: ["status", "data", "message", "errors"],
        properties: {
          status: { type: "string", example: "error" },
          data: { type: "object", nullable: true, example: null },
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
                  example: "This game looks awesome",
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
        description: "Validatsiya xatosi",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
          },
        },
      },
      Unauthorized: {
        description: "Token not provided, invalid, or expired",
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
        tags: ["Authentication"],
        summary: "Register a user",
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
        tags: ["Authentication"],
        summary: "Log in a user",
        requestBody: { $ref: "#/components/requestBodies/LoginBody" },
        responses: {
          "200": {
            description: "Logged-in user and token",
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
        tags: ["Authentication"],
        summary: "Get the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
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
        tags: ["Categories"],
        summary: "List categories",
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
          { name: "q", in: "query", schema: { type: "string", maxLength: 200 } },
        ],
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
        summary: "Create a category",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CategoryCreateBody" },
        responses: {
          "201": {
            description: "Created category",
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
        tags: ["Categories"],
        summary: "Get a category by id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Category",
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
        tags: ["Categories"],
        summary: "Update a category",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { $ref: "#/components/requestBodies/CategoryUpdateBody" },
        responses: {
          "200": {
            description: "Updated category",
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
        tags: ["Categories"],
        summary: "Delete a category",
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
        tags: ["Comments"],
        summary: "List, filter, or randomly fetch comments",
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
        summary: "Create a comment",
        security: [{ bearerAuth: [] }],
        requestBody: { $ref: "#/components/requestBodies/CommentCreateBody" },
        responses: {
          "201": {
            description: "Created comment",
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
    "/comments/stats": {
      get: {
        tags: ["Comments"],
        summary: "Comment statistics (filterable)",
        description:
          "total_comments changes based on the filters, while total_categories is always the total number of categories.",
        parameters: [
          { name: "categoryId", in: "query", schema: { type: "string" } },
          { name: "category_id", in: "query", schema: { type: "string" } },
          {
            name: "sentiment",
            in: "query",
            schema: { $ref: "#/components/schemas/Sentiment" },
          },
          { name: "q", in: "query", schema: { type: "string", maxLength: 200 } },
        ],
        responses: {
          "200": {
            description: "Statistics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentStatsResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/comments/{id}": {
      get: {
        tags: ["Comments"],
        summary: "Get a comment by id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Comment",
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
        tags: ["Comments"],
        summary: "Update a comment",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: { $ref: "#/components/requestBodies/CommentUpdateBody" },
        responses: {
          "200": {
            description: "Updated comment",
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
        tags: ["Comments"],
        summary: "Delete a comment",
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
    "/comments/upload": {
      post: {
        tags: ["Comments"],
        summary: "Import comments from an Excel (.xlsx) or .csv file",
        description:
          "Upload an .xlsx or .csv file with columns `category`, `text`, `sentiment`. Each row becomes a comment; if the category does not exist it is created automatically. `sentiment` must be one of POSITIVE, FUNNY, CRITICAL (case-insensitive). Invalid rows are skipped and reported in `errors`. Legacy .xls is not supported — re-save as .xlsx.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: ".xlsx or .csv file (max 4MB)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Import summary",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CommentUploadResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/comments/upload/template": {
      get: {
        tags: ["Comments"],
        summary: "Download the Excel import template",
        description:
          "Returns a ready-to-fill .xlsx template with the required headers (category, text, sentiment), example rows, and a sentiment dropdown limited to POSITIVE, FUNNY, CRITICAL.",
        responses: {
          "200": {
            description: "Excel template file",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
    "/comments/bulk-copy": {
      post: {
        tags: ["Comments"],
        summary: "Get newline-separated comments for copying to the clipboard",
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
