import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is not set or is a placeholder in .env");

    process.exit(1);
  }

  const sqlFilePath = path.join(__dirname, "001-create-tables.sql");
  const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

  console.log("Connecting to database...");
  const sql = neon(databaseUrl);

  try {
    console.log("Executing SQL script...");

    // Split the script by semicolons and filter out empty statements
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await sql(statement);
    }

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error executing SQL script:", error);
    process.exit(1);
  }
}

setup();
