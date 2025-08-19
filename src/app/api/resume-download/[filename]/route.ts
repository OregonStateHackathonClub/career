import { downloadFile } from "@/lib/storage";
import { NextResponse } from "next/server";
export const runtime = "nodejs";


export async function GET(
    req: Request,
    context: { params: { filename: string } }
) {
    const { filename } = context.params; 
    try {
        const { buffer } = await downloadFile(filename);

        return new Response(new Uint8Array (buffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${filename}"`,
            },
        });
    } catch {
        return NextResponse.json({ error: "Resume not found" }, { status: 400 });
    }
}