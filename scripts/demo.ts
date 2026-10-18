// npm run demo: the whole app with zero accounts or keys. Starts MongoDB in
// memory, seeds it, and runs `next dev` in demo mode (no Clerk; every
// request acts as the seeded "Demo Visitor"). Data is gone when it stops.
import { spawn } from "node:child_process";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import mongoose from "mongoose";
import { seedDemoData } from "./seed-data";

async function main() {
  const port = process.env.PORT ?? "3000";

  console.log(
    "Starting MongoDB in memory (the first run downloads a mongod binary)...",
  );
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri("brainstorm-verse");

  process.env.MONGODB_URL = uri;
  const summary = await seedDemoData();
  await mongoose.disconnect();
  console.log(
    `Seeded ${summary.users} users, ${summary.ideas} ideas, ${summary.replies} replies and ${summary.votes} upvotes.`,
  );

  const nextBin = require.resolve("next/dist/bin/next");
  const app = spawn(process.execPath, [nextBin, "dev", "--port", port], {
    stdio: "inherit",
    env: { ...process.env, MONGODB_URL: uri, NEXT_PUBLIC_DEMO_MODE: "true" },
  });

  const shutdown = () => app.kill("SIGINT");
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  app.on("exit", async (code) => {
    await mongo.stop();
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
