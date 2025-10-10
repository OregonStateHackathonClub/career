import { downloadFile } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: filename } = await params;
  try {
    const { buffer } = await downloadFile(filename);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Resume not found" }, { status: 400 });
  }
}
