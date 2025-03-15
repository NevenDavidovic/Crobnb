import { readItems, readItem, aggregate } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const NovostiService = {
  async getNovostiCount(directus: Client): Promise<number> {
    try {
      const result = await directus.request(
        aggregate("novosti", {
          aggregate: {
            count: ["id"],
          },
        })
      );

      const count = result?.[0]?.count?.id;
      return typeof count === "string" ? parseInt(count, 10) : count || 0;
    } catch (error) {
      console.error("Error getting novosti count:", error);
      return 0;
    }
  },

  async getNovostiByKategorijaCount(
    directus: Client,
    kategorijaId: number
  ): Promise<number> {
    try {
      const result = await directus.request(
        aggregate("novosti", {
          aggregate: {
            count: ["id"],
          },
          filter: {
            kategorija_novosti_id: {
              _eq: kategorijaId,
            },
          },
        })
      );

      const count = result?.[0]?.count?.id;
      return typeof count === "string" ? parseInt(count, 10) : count || 0;
    } catch (error) {
      console.error(
        `Error getting novosti count for category ${kategorijaId}:`,
        error
      );
      return 0;
    }
  },

  async getNovosti(directus: Client, limit?: number) {
    // If limit is not provided, get the total count
    const actualLimit = limit || (await this.getNovostiCount(directus));

    return await directus.request(
      readItems("novosti", {
        fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
        sort: ["-date_created"],
        limit: actualLimit,
      })
    );
  },

  async getNovost(directus: Client, id: number) {
    return await directus.request(
      readItem("novosti", id, {
        fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
      })
    );
  },

  async getNovostiByKategorija(
    directus: Client,
    kategorijaId: number,
    limit?: number
  ) {
    const actualLimit =
      limit || (await this.getNovostiByKategorijaCount(directus, kategorijaId));

    return await directus.request(
      readItems("novosti", {
        fields: ["*", { hero_slika: ["*"] }, { kategorija_novosti: ["*"] }],
        filter: {
          kategorija_novosti_id: {
            _eq: kategorijaId,
          },
        },
        sort: ["-date_created"],
        limit: actualLimit,
      })
    );
  },

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

  async getKategorijeNovosti(directus: Client) {
    return await directus.request(
      readItems("kategorija_novosti", {
        fields: ["*"],
      })
    );
  },
};
