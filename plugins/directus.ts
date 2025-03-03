import { defineNuxtPlugin } from "#app";
import {
  createDirectus,
  rest,
  readItems,
  readItem,
  authentication,
} from "@directus/sdk";
import type { DirectusFile } from "~/types/directus";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const directus = createDirectus(config.public.directusUrl)
    .with(rest())
    .with(authentication());

  return {
    provide: {
      directus,
      // TipoviSmjestaja methods
      async getTipoviSmjestaja() {
        return await directus.request(
          readItems("tipovi_smjestaja", {
            fields: ["*", "ikona.*"],
          })
        );
      },
      async getTipSmjestaja(id: number) {
        return await directus.request(
          readItem("tipovi_smjestaja", id, {
            fields: ["*", "ikona.*"],
          })
        );
      },

      async getTipSmjestajaBySlug(slug: string) {
        return await directus
          .request(
            readItems("tipovi_smjestaja", {
              fields: ["*", "ikona.*"],
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

      // Regija methods
      async getRegije() {
        return await directus.request(
          readItems("regija", {
            fields: ["*", "slika.*"],
          })
        );
      },
      async getRegija(id: number) {
        return await directus.request(
          readItem("regija", id, {
            fields: ["*", "slika.*"],
          })
        );
      },
      async getRegijaBySlug(slug: string) {
        return await directus
          .request(
            readItems("regija", {
              fields: ["*", "slika.*"],
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

      async getNovosti(limit?: number) {
        return await directus.request(
          readItems("novosti", {
            fields: ["*", "hero_slika.*", "kategorija_novosti.*"],
            sort: ["-date_created"],
            limit: limit || 10,
          })
        );
      },
      async getNovost(id: number) {
        return await directus.request(
          readItem("novosti", id, {
            fields: ["*", "hero_slika.*", "kategorija_novosti.*"],
          })
        );
      },
      async getNovostiByKategorija(kategorijaId: number, limit?: number) {
        return await directus.request(
          readItems("novosti", {
            fields: ["*", "hero_slika.*", "kategorija_novosti.*"],
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
      async getNovostBySlug(slug: string) {
        return await directus
          .request(
            readItems("novosti", {
              fields: ["*", "hero_slika.*", "kategorija_novosti.*"],
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

      async getKategorijeNovosti() {
        return await directus.request(
          readItems("kategorija_novosti", {
            fields: ["*"],
          })
        );
      },

      getFileUrl(fileId: string | DirectusFile | null) {
        if (!fileId) return null;

        if (typeof fileId === "string") {
          return `${config.public.directusUrl}/assets/${fileId}`;
        }

        if (
          fileId &&
          typeof fileId === "object" &&
          "id" in fileId &&
          fileId.id
        ) {
          return `${config.public.directusUrl}/assets/${fileId.id}`;
        }

        return null;
      },
    },
  };
});
