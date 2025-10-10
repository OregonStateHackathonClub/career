import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME!);

export const downloadFile = async (resumePath: string) => {
  const file = bucket.file(resumePath);
  const [fileContents] = await file.download();

  return {
    buffer: fileContents,
    filename: resumePath,
  };
};
