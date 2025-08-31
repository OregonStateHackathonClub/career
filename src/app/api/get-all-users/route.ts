import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({ include: { careerProfile: true } });
    const careerProfiles: Object[] = [];

    users.forEach(user => {
      if (!user.careerProfile)
        return;
      careerProfiles.push({ ...user.careerProfile, name: user.name });
    });

    return NextResponse.json({ careerProfiles: careerProfiles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}