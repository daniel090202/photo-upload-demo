import { NextResponse } from "next/server";
import {
  sql,
  type Photo,
  type Comment,
  type PhotoWithComments,
} from "@/lib/db";

export async function GET() {
  try {
    const photos = (await sql`
      SELECT * FROM photos ORDER BY created_at DESC
    `) as Photo[];

    const comments = (await sql`
      SELECT * FROM comments ORDER BY created_at ASC
    `) as Comment[];

    const commentsByPhoto = comments.reduce(
      (acc, comment) => {
        if (!acc[comment.photo_id]) {
          acc[comment.photo_id] = [];
        }
        acc[comment.photo_id].push(comment);
        return acc;
      },
      {} as Record<number, Comment[]>,
    );

    const photosWithComments: PhotoWithComments[] = photos.map((photo) => ({
      ...photo,
      comments: commentsByPhoto[photo.id] || [],
    }));

    return NextResponse.json({ photos: photosWithComments });
  } catch (error) {
    console.error("Error fetching photos:", error);

    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
