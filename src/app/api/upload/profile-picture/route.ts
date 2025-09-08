import { uploadProfilePicture } from "@/lib/storage";
export const runtime = "nodejs";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return new Response("No file", { status: 400 });

    const { fileName, url } = await uploadProfilePicture(file);
    return Response.json({ fileName, url });
}
