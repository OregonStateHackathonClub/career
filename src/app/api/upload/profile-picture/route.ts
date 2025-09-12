import { uploadProfilePicture } from "@/lib/storage";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    const { fileName, url } = await uploadProfilePicture(file);
    return Response.json({ fileName, url });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}