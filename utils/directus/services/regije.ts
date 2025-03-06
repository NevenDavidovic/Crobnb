import { readItems, readItem } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const RegijeService = {
  async getRegije(directus: Client) {
    return await directus.request(
      readItems("regija", {
        fields: ["*", { slika: ["*"] }],
      })
    );
  },

  async getRegija(directus: Client, id: number) {
    return await directus.request(
      readItem("regija", id, {
        fields: ["*", { slika: ["*"] }],
      })
    );
  },

  async getRegijaBySlug(directus: Client, slug: string) {
    return await directus
      .request(
        readItems("regija", {
          fields: ["*", { slika: ["*"] }],
          filter: {
            slug: {
              _eq: slug,
            },
          },
          limit: 1,
        })
      )
      .then((response) =>
        response && response.length > 0 ? response[0] : null
      );
  },
};
