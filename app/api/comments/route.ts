import { type NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { photoId, content, author } = await request.json()

    if (!photoId || !content) {
      return NextResponse.json(
        { error: 'Photo ID and content are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO comments (photo_id, content, author)
      VALUES (${photoId}, ${content}, ${author || 'Anonymous'})
      RETURNING *
    `

    return NextResponse.json({ comment: result[0] })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
