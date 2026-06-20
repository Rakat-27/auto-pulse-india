export type CloudinaryUpload = {
  secureUrl: string;
  publicId: string;
};

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "",
};

export async function uploadProductImage(file: File): Promise<CloudinaryUpload> {
  const { cloudName, uploadPreset } = cloudinaryConfig;
  if (!cloudName || !uploadPreset) {
    throw new Error("Add the Cloudinary cloud name and unsigned upload preset to .env first.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);
  body.append("folder", "auto-pulse/products");

  let response: Response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("Image upload timed out. Check your connection and try a smaller image.");
    }
    throw new Error("Unable to reach Cloudinary. Check your connection and try again.");
  }

  const result = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(result.error?.message || "Cloudinary upload failed.");
  }

  return { secureUrl: result.secure_url, publicId: result.public_id };
}
