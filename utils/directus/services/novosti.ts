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
 * Service for handling News (Novosti) related requests
 */
export const NovostiService = {
  /**
   * Get all news articles
   * @param directus Directus client instance
   * @param limit Maximum number of news to return
   * @returns Promise with news articles
   */
  async getNovosti(directus: Client, limit?: number) {
    return await directus.request(
      readItems("novosti", {
        fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  /**
   * Get a single news article by ID
   * @param directus Directus client instance
   * @param id News article ID
   * @returns Promise with news article
   */
  async getNovost(directus: Client, id: number) {
    return await directus.request(
      readItem("novosti", id, {
        fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
      })
    );
  },

  /**
   * Get news articles by category
   * @param directus Directus client instance
   * @param kategorijaId Category ID
   * @param limit Maximum number of news to return
   * @returns Promise with news articles
   */
  async getNovostiByKategorija(
    directus: Client,
    kategorijaId: number,
    limit?: number
  ) {
    return await directus.request(
      readItems("novosti", {
        fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
        filter: {
          kategorija_novosti_id: {
            _eq: kategorijaId,
          },
        },
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  /**
   * Get a single news article by slug
   * @param directus Directus client instance
   * @param slug News article slug
   * @returns Promise with news article or null
   */
  async getNovostBySlug(directus: Client, slug: string) {
    return await directus
      .request(
        readItems("novosti", {
          fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
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

  /**
   * Get all news categories
   * @param directus Directus client instance
   * @returns Promise with news categories
   */
  async getKategorijeNovosti(directus: Client) {
    return await directus.request(
      readItems("kategorija_novosti", {
        fields: ["*"],
      })
    );
  },
};
