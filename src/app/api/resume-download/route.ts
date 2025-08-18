import { downloadFile } from "@/lib/storage";
import { NextResponse } from "next/server";

import { bucket } from "@/lib/storage";
export const runtime = "nodejs";


export async function GET(
    req: Request,
    { params }: { params: { filename: string}}
) {
    const { filename } = params; 
    try {
        const file = bucket.file(filename);
        const [fileContents] = await file.download();

        return new Response(new Uint8Array (fileContents), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename" + filename,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: "Resume not found" }, { status: 400 });
    }
}