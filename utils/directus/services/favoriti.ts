import { createItem, readItems, deleteItem, readItem } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const FavoritiService = {
  async addFavorite(directus: Client, userId: string, smjestajId: number) {
    return await directus.request(
      createItem("favoriti", {
        user_id: userId,
        smjestaj_id: smjestajId,
      })
    );
  },

  async getFavorites(directus: Client, userId: string) {
    console.log("[FavoritiService] Getting favorites for user:", userId);

    try {
      const favorites = await directus.request(
        readItems("favoriti", {
          filter: {
            user_id: {
              _eq: userId,
            },
          },
          fields: ["*"],
        })
      );

      if (!Array.isArray(favorites) || favorites.length === 0) {
        return [];
      }

      const favoritesWithCompleteSmjestaj = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const smjestajData = await directus.request(
              readItems("smjestaj", {
                filter: {
                  id: {
                    _eq: favorite.smjestaj_id,
                  },
                },
                fields: ["*", { thumbnail: ["*"] }],
              })
            );

            if (!smjestajData || smjestajData.length === 0) {
              console.warn(
                `[FavoritiService] No smjestaj found for ID: ${favorite.smjestaj_id}`
              );
              return favorite;
            }

            let smjestaj = smjestajData[0];
            console.log(
              `[FavoritiService] Found smjestaj for ID: ${favorite.smjestaj_id}`
            );

            let regija = smjestaj.regija;
            if (!regija && smjestaj.regija_id) {
              regija = await directus.request(
                readItem("regija", smjestaj.regija_id, {
                  fields: ["*", { slika: ["*"] }],
                })
              );
              console.log(
                `[FavoritiService] Fetched regija for smjestaj: ${smjestaj.id}`
              );
            }

            let tipSmjestaja = smjestaj.tip_smjestaja;
            if (!tipSmjestaja && smjestaj.tipovi_smjestaja_id) {
              tipSmjestaja = await directus.request(
                readItem("tipovi_smjestaja", smjestaj.tipovi_smjestaja_id, {
                  fields: ["*", { ikona: ["*"] }],
                })
              );
              console.log(
                `[FavoritiService] Fetched tip_smjestaja for smjestaj: ${smjestaj.id}`
              );
            }

            const smjestajSadrzaji = await directus.request(
              readItems("smjestaj_sadrzaji", {
                fields: ["*", { sadrzaj: ["*", { icon: ["*"] }] }],
                filter: {
                  smjestaj_id: {
                    _eq: smjestaj.id,
                  },
                },
                limit: -1,
              })
            );
            console.log(
              `[FavoritiService] Fetched ${smjestajSadrzaji.length} sadrzaji for smjestaj: ${smjestaj.id}`
            );

            for (let i = 0; i < smjestajSadrzaji.length; i++) {
              if (
                !smjestajSadrzaji[i].sadrzaj &&
                smjestajSadrzaji[i].sadrzaj_id
              ) {
                const sadrzaj = await directus.request(
                  readItem("sadrzaji", smjestajSadrzaji[i].sadrzaj_id, {
                    fields: ["*", { icon: ["*"] }],
                  })
                );

                smjestajSadrzaji[i] = {
                  ...smjestajSadrzaji[i],
                  sadrzaj: sadrzaj,
                };
              }
            }

            const completeSmjestaj = {
              ...smjestaj,
              regija: regija,
              tip_smjestaja: tipSmjestaja,
              sadrzaji: smjestajSadrzaji,
            };

            return {
              ...favorite,
              smjestaj: completeSmjestaj,
            };
          } catch (err) {
            console.error(
              `[FavoritiService] Error fetching complete data for smjestaj ID ${favorite.smjestaj_id}:`,
              err
            );
            return favorite;
          }
        })
      );

      const validFavorites = favoritesWithCompleteSmjestaj.filter(
        (fav) => fav.smjestaj && fav.smjestaj.id
      );

      console.log(
        `[FavoritiService] Successfully processed ${validFavorites.length} of ${favorites.length} favorites`
      );

      return validFavorites;
    } catch (error) {
      console.error("[FavoritiService] Error in getFavorites:", error);
      throw error;
    }
  },

  async removeFavorite(directus: Client, favoriteId: number) {
    return await directus.request(deleteItem("favoriti", favoriteId));
  },
};
