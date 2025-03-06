import { createDirectus, rest, authentication } from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";

export const createDirectusClient = (directusUrl: string) => {
  return createDirectus<Schema>(directusUrl)
    .with(rest())
    .with(authentication());
};
