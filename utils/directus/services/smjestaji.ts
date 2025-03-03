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
 * Service for handling Accommodation (Smjestaj) related requests
 */
export const SmjestajiService = {
  /**
   * Get all accommodation listings
   * @param directus Directus client instance
   * @param limit Maximum number of items to return
   * @returns Promise with accommodation listings
   */
  async getSmjestaji(directus: Client, limit?: number) {
    return await directus.request(
      readItems("smjestaj", {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { ikona: ["*"] }] }] },
        ],
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  /**
   * Get a single accommodation by ID
   * @param directus Directus client instance
   * @param id Accommodation ID
   * @returns Promise with accommodation details
   */
  async getSmjestaj(directus: Client, id: number) {
    return await directus.request(
      readItem("smjestaj", id, {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { ikona: ["*"] }] }] },
        ],
      })
    );
  },

  /**
   * Get accommodation listings by region
   * @param directus Directus client instance
   * @param regijaId Region ID
   * @param limit Maximum number of items to return
   * @returns Promise with accommodation listings
   */
  async getSmjestajiByRegija(
    directus: Client,
    regijaId: number,
    limit?: number
  ) {
    return await directus.request(
      readItems("smjestaj", {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { ikona: ["*"] }] }] },
        ],
        filter: {
          regija_id: {
            _eq: regijaId,
          },
        },
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  /**
   * Get accommodation listings by type
   * @param directus Directus client instance
   * @param tipId Accommodation type ID
   * @param limit Maximum number of items to return
   * @returns Promise with accommodation listings
   */
  async getSmjestajiByTip(directus: Client, tipId: number, limit?: number) {
    return await directus.request(
      readItems("smjestaj", {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { ikona: ["*"] }] }] },
        ],
        filter: {
          smjestaj_id: {
            _eq: tipId,
          },
        },
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  /**
   * Get a single accommodation by slug
   * @param directus Directus client instance
   * @param slug Accommodation slug
   * @returns Promise with accommodation details or null
   */
  async getSmjestajBySlug(directus: Client, slug: string) {
    return await directus
      .request(
        readItems("smjestaj", {
          fields: [
            "*",
            { thumbnail: ["*"] },
            { regija: ["*", { slika: ["*"] }] },
            { tip_smjestaja: ["*", { ikona: ["*"] }] },
            { sadrzaji: ["*", { sadrzaj: ["*", { ikona: ["*"] }] }] },
          ],
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
   * Get all amenities (sadrzaji)
   * @param directus Directus client instance
   * @returns Promise with all amenities
   */
  async getSadrzaji(directus: Client) {
    return await directus.request(
      readItems("sadrzaji", {
        fields: ["*", { ikona: ["*"] }],
      })
    );
  },
};
