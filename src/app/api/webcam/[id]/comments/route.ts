import { NextResponse } from 'next/server';
import { getWebcamData, addComment, incrementVisitCount } from '@/lib/comments';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getWebcamData(id);
  return NextResponse.json(data);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (body.action === 'comment' && body.text) {
    await addComment(id, body.text);
    // Return the updated data immediately
    const updatedData = await getWebcamData(id);
    return NextResponse.json(updatedData);
  }
  
  if (body.action === 'visit') {
    await incrementVisitCount(id);
    // Return the updated data immediately
    const updatedData = await getWebcamData(id);
    return NextResponse.json(updatedData);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
