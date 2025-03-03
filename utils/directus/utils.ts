import type { DirectusFile } from "~/types/directus";

/**
 * Get URL for a Directus file
 * @param fileId File ID or DirectusFile object
 * @param directusUrl Base URL for Directus instance
 * @returns URL for the file or null if not found
 */
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
