import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const careerProfiles = await prisma.careerProfile.findMany({
      include: {
        user: {
          include: { sessions: true }
        }
      }
    });

    return NextResponse.json({ careerProfiles: careerProfiles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}