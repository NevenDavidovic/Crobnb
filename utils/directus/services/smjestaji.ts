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

export const SmjestajiService = {
  async getSmjestaji(directus: Client, limit?: number) {
    return await directus.request(
      readItems("smjestaj", {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
        ],
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  async getSmjestaj(directus: Client, id: number) {
    return await directus.request(
      readItem("smjestaj", id, {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
        ],
      })
    );
  },

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
          { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
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

  async getSmjestajiByTip(directus: Client, tipId: number, limit?: number) {
    return await directus.request(
      readItems("smjestaj", {
        fields: [
          "*",
          { thumbnail: ["*"] },
          { regija: ["*", { slika: ["*"] }] },
          { tip_smjestaja: ["*", { ikona: ["*"] }] },
          { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
        ],
        filter: {
          tipovi_smjestaja_id: {
            _eq: tipId,
          },
        },
        sort: ["-date_created"],
        limit: limit || 10,
      })
    );
  },

  async getSmjestajBySlug(directus: Client, slug: string) {
    return await directus
      .request(
        readItems("smjestaj", {
          fields: [
            "*",
            { thumbnail: ["*"] },
            { regija: ["*", { slika: ["*"] }] },
            { tip_smjestaja: ["*", { ikona: ["*"] }] },
            { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
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

  async getSmjestajSadrzajiRelations(directus: Client) {
    return await directus.request(
      readItems("smjestaj_sadrzaji", {
        fields: [
          "id",
          "smjestaj_id",
          "sadrzaj_id",
          { sadrzaj: ["*", { icon: ["*"] }] },
        ],
      })
    );
  },

  async getSadrzaji(directus: Client) {
    return await directus.request(
      readItems("sadrzaji", {
        fields: ["*", { icon: ["*"] }],
      })
    );
  },
};
