import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { sql, type Photo } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    const title = formData.get("title") as string | null;

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedPhotos = [];

    for (const file of files) {
      const blob = await put(`photos/${Date.now()}-${file.name}`, file, {
        access: "private",
      });

      const result = (await sql`
        INSERT INTO photos (url, pathname, title)
        VALUES (${blob.url}, ${blob.pathname}, ${title || null})
        RETURNING *
      `) as Photo[];

      uploadedPhotos.push(result[0]);
    }

    return NextResponse.json({ photos: uploadedPhotos });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
