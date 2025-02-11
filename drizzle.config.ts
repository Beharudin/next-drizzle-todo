import "dotenv/config"; 
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default defineConfig({
  out: "./app/db/drizzle",  // Where migration files will be stored
  schema: "./app/db/schema.ts",  // Path to your database schema
  dialect: "mysql",  // Specifies MySQL as the database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
