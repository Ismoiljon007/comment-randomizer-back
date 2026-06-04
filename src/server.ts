import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`Backend API http://localhost:${env.PORT} manzilida tinglanyapti`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`${signal} signali olindi, server to'xtatilmoqda`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
