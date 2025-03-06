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

export const SmjestajService = {
  async getTipoviSmjestaja(directus: Client) {
    return await directus.request(
      readItems("tipovi_smjestaja", {
        fields: ["*", { ikona: ["*"] }],
      })
    );
  },

  async getTipSmjestaja(directus: Client, id: number) {
    return await directus.request(
      readItem("tipovi_smjestaja", id, {
        fields: ["*", { ikona: ["*"] }],
      })
    );
  },

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
