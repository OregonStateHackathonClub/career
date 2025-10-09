import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME!);

export const uploadFile = async (file: File, isPublic: boolean) => {
  const fileName = `${Date.now()}-${file.name}`;
  const blob = bucket.file(fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blob.save(buffer, {
    contentType: file.type,
    public: isPublic,
  });

  const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${fileName}`;
  return isPublic ? publicUrl : fileName;
};

export const downloadFile = async (resumePath: string) => {
  const file = bucket.file(resumePath);

  const [fileContents] = await file.download();

  return {
    buffer: fileContents,
    filename: resumePath,
  };
};

// Profile picture uploads
export const uploadProfilePicture = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const blob = bucket.file(fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blob.save(buffer, { contentType: file.type });

  // Returning a signed URL
  const [url] = await blob.getSignedUrl({
    action: "read",
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });

  return { fileName, url };
};

// Helper to generate signed URL for an existing file
export const getSignedUrl = async (fileName: string, expiresInHours = 24) => {
  const file = bucket.file(fileName);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInHours * 60 * 60 * 1000, // default 24 hours
  });

  return url;
};
