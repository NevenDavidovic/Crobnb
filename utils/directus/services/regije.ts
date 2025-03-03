import { readItems, readItem } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/schema";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

/**
 * Service for handling Region (Regije) related requests
 */
export const RegijeService = {
  /**
   * Get all regions
   * @param directus Directus client instance
   * @returns Promise with regions
   */
  async getRegije(directus: Client) {
    return await directus.request(
      readItems("regija", {
        fields: ["*", { slika: ["*"] }],
      })
    );
  },

  /**
   * Get a single region by ID
   * @param directus Directus client instance
   * @param id Region ID
   * @returns Promise with region
   */
  async getRegija(directus: Client, id: number) {
    return await directus.request(
      readItem("regija", id, {
        fields: ["*", { slika: ["*"] }],
      })
    );
  },

  /**
   * Get a single region by slug
   * @param directus Directus client instance
   * @param slug Region slug
   * @returns Promise with region or null
   */
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
