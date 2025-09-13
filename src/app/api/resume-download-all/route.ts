// /app/api/resume-download-all/route.ts
import { NextResponse } from "next/server";
import archiver from "archiver";
import prisma from "@/lib/prisma"; // adjust to your Prisma client
import { downloadFile } from "@/lib/storage"; // your helper for fetching files

export const runtime = "nodejs";

export async function GET() {
  const careerProfiles = await prisma.careerProfile.findMany({
    include: { user: true },
  });

  const stream = new ReadableStream({
    start(controller) {
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      archive.on("end", () => controller.close());
      archive.on("error", (err: Error) => controller.error(err));

      (async () => {
        for (const profile of careerProfiles) {
          try {
            const { buffer } = await downloadFile(profile.resumePath ?? "");
            archive.append(buffer, { name: `${profile.user.name}.pdf` });
          } catch (err) {
            console.error(`Error fetching resume for ${profile.userId}`, err);
          }
        }
        archive.finalize();
      })();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="all-resumes.zip"',
    },
  });
}
