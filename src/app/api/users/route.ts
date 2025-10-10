import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
