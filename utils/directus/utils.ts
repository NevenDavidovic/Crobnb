import type { DirectusFile } from "~/types/directus";

export const getFileUrl = (
  fileId: string | DirectusFile | null,
  directusUrl: string
): string | null => {
  if (!fileId) return null;

  if (typeof fileId === "string") {
    return `${directusUrl}/assets/${fileId}`;
  }

  if (fileId && typeof fileId === "object" && "id" in fileId && fileId.id) {
    return `${directusUrl}/assets/${fileId.id}`;
  }

  return null;
};
