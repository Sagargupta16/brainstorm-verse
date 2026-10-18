// npm run seed: load the demo dataset into the database in MONGODB_URL
// (read from the environment or .env.local). Only seed-owned users and their
// ideas are replaced; anything else in the database is left alone.
import mongoose from "mongoose";
import { seedDemoData } from "./seed-data";

async function main() {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // No .env.local: fall back to the variables already in the environment
  }

  if (!process.env.MONGODB_URL) {
    console.error(
      "MONGODB_URL is not set. Add it to .env.local or the environment.",
    );
    process.exit(1);
  }

  const summary = await seedDemoData();
  console.log(
    `Seeded ${summary.users} users, ${summary.ideas} ideas, ${summary.replies} replies and ${summary.votes} upvotes.`,
  );
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
