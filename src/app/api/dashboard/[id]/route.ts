import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch user dashboard data by user id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Update user dashboard data by user id
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  try {
    const body = await request.json();

    if (!body.name && !body.email) {
      return NextResponse.json(
        { error: 'At least one field (name or email) is required' }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Update or create failed' }, { status: 500 });
  }
}
