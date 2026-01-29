export const getPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    // Everything after /upload/v1234567890/
    const publicPath = parts.slice(uploadIndex + 2).join("/");

    // Remove file extension
    const publicId = publicPath.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
};
