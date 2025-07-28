import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Fetch user dashboard data by user id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true, accounts: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Update user dashboard data by user id
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const body = await request.json();
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        image: body.image,
        email: body.email
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
