import { getSignedUrl } from "@/lib/storage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

    // Generate signed URL for the existing file
    const signedUrl = await getSignedUrl(filename, 24); // 24 hours expiration

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error getting profile picture signed URL:", error);
    return NextResponse.json(
      { error: "Failed to get profile picture URL" },
      { status: 500 },
    );
  }
}
