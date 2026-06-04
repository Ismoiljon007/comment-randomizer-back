import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";

export const docsRouter = Router();

docsRouter.get("/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

docsRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Comment Randomizer API Hujjatlari",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);
