import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../docs/openapi";

export const docsRouter = Router();

docsRouter.get("/docs.json", (_req, res) => {
  res.json(openApiSpec);
});

docsRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Comment Randomizer API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);
