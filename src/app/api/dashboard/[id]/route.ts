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
      include: { sessions: true },
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
    let user;
    try {
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          name: body.name,
          email: body.email
        },
      });
    } catch (error) {
      // If user not found, create it (let Prisma generate id)
      user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          googleId: body.googleId,
        },
      });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Update or create failed' }, { status: 500 });
  }
}
