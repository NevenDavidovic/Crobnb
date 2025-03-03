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

/**
 * Service for handling Accommodation (TipoviSmjestaja) related requests
 */
export const SmjestajService = {
  /**
   * Get all accommodation types
   * @param directus Directus client instance
   * @returns Promise with accommodation types
   */
  async getTipoviSmjestaja(directus: Client) {
    return await directus.request(
      readItems("tipovi_smjestaja", {
        fields: ["*", { ikona: ["*"] }],
      })
    );
  },

  /**
   * Get a single accommodation type by ID
   * @param directus Directus client instance
   * @param id Accommodation type ID
   * @returns Promise with accommodation type
   */
  async getTipSmjestaja(directus: Client, id: number) {
    return await directus.request(
      readItem("tipovi_smjestaja", id, {
        fields: ["*", { ikona: ["*"] }],
      })
    );
  },

  /**
   * Get a single accommodation type by slug
   * @param directus Directus client instance
   * @param slug Accommodation type slug
   * @returns Promise with accommodation type or null
   */
  async getTipSmjestajaBySlug(directus: Client, slug: string) {
    return await directus
      .request(
        readItems("tipovi_smjestaja", {
          fields: ["*", { ikona: ["*"] }],
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
