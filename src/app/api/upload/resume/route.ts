import { uploadFile } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return new Response("No file", { status: 400 });

  const fileName = await uploadFile(file, false);
  return Response.json({ fileName });
}
