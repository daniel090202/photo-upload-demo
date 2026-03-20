import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Database URL is missing. Please check your DATABASE_URL in .env",
  );
}

export const sql = neon(databaseUrl);

export interface Photo {
  id: number;
  url: string;
  pathname: string;
  title: string | null;
  created_at: string;
}

export interface Comment {
  id: number;
  photo_id: number;
  content: string;
  author: string;
  created_at: string;
}

export interface PhotoWithComments extends Photo {
  comments: Comment[];
}
