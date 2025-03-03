import { createDirectus, rest, authentication } from "@directus/sdk";
import type { Schema } from "~/types/directus/schema";

/**
 * Create and configure Directus client
 * @param directusUrl Base URL for Directus instance
 * @returns Configured Directus client
 */
export const createDirectusClient = (directusUrl: string) => {
  return createDirectus<Schema>(directusUrl)
    .with(rest())
    .with(authentication());
};
