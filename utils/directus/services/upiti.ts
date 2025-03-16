// utils/directus/services/upiti.ts
import { createItem } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";
import type { UpitFormData } from "~/types/directus/exports/upit";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const UpitiService = {
  async createUpit(directus: Client, upitData: UpitFormData) {
    return await directus.request(createItem("upiti_za_rezervaciju", upitData));
  },
};
