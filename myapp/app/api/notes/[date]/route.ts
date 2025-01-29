import { NextResponse } from "next/server"
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(
  request: Request,
  { params }: { params: { date: string } }
) {
  const formData = await request.formData()
  const note = formData.get('note') as string
  const media = formData.get('media') as File

  if (media) {
    const bytes = await media.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${params.date}-${media.name}`
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
    await writeFile(filepath, buffer)
  }

  // In a real app, save note to database
  return NextResponse.json({ success: true })
} 