// smjestaji.ts
import { readItems, readItem } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";
import type { SmjestajWithRelations } from "~/types/directus/exports/all_data_smjestaj_interface";
import type { ApiError } from "~/types/directus/exports/directus-error";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const SmjestajiService = {
  async getSmjestaji(directus: Client, limit?: number) {
    try {
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
    } catch (error: unknown) {
      console.error("Error getting smjestaji:", error);
      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const message =
          apiError.errors?.[0]?.message ||
          apiError.message ||
          "Nepoznata greška";

        throw new Error(`Greška pri dohvaćanju smještaja: ${message}`);
      }
      throw new Error("Nepoznata greška pri dohvaćanju smještaja");
    }
  },

  async getSmjestajiByCity(directus: Client, city: string, limit?: number) {
    try {
      const smjestaji = await directus.request(
        readItems("smjestaj", {
          fields: [
            "*",
            { thumbnail: ["*"] },
            { regija: ["*", { slika: ["*"] }] },
            { tip_smjestaja: ["*", { ikona: ["*"] }] },
            { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
          ],
          filter: {
            grad: {
              _eq: city,
            },
          },
          sort: ["-date_created"],
          limit: limit || -1,
        })
      );

      if (smjestaji.length > 0 && !smjestaji[0].tip_smjestaja) {
        const tipoviIds = [
          ...new Set(smjestaji.map((s) => s.tipovi_smjestaja_id)),
        ].filter(Boolean);

        if (tipoviIds.length > 0) {
          const tipoviSmjestaja = await directus.request(
            readItems("tipovi_smjestaja", {
              fields: ["*", { ikona: ["*"] }],
              filter: {
                id: {
                  _in: tipoviIds,
                },
              },
            })
          );

          return smjestaji.map((smjestaj) => ({
            ...smjestaj,
            tip_smjestaja:
              tipoviSmjestaja.find(
                (t) => t.id === smjestaj.tipovi_smjestaja_id
              ) || null,
          }));
        }
      }

      return smjestaji;
    } catch (error: unknown) {
      console.error(`Error getting smjestaji by city ${city}:`, error);
      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const message =
          apiError.errors?.[0]?.message ||
          apiError.message ||
          "Nepoznata greška";

        throw new Error(`Greška pri dohvaćanju smještaja: ${message}`);
      }
      throw new Error(
        `Nepoznata greška pri dohvaćanju smještaja za grad ${city}`
      );
    }
  },

  async getSmjestaj(directus: Client, id: number) {
    try {
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
    } catch (error: unknown) {
      console.error(`Error getting smjestaj with id ${id}:`, error);
      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const message =
          apiError.errors?.[0]?.message ||
          apiError.message ||
          "Nepoznata greška";

        throw new Error(`Greška pri dohvaćanju smještaja: ${message}`);
      }
      throw new Error(
        `Nepoznata greška pri dohvaćanju smještaja s ID-om ${id}`
      );
    }
  },

  async getSmjestajiByRegija(
    directus: Client,
    regijaId: number,
    limit?: number
  ): Promise<SmjestajWithRelations[]> {
    try {
      // Get basic smjestaji filtered by region first
      const smjestaji = await directus.request(
        readItems("smjestaj", {
          fields: [
            "*",
            { thumbnail: ["*"] },
            { regija: ["*", { slika: ["*"] }] },
            { tip_smjestaja: ["*", { ikona: ["*"] }] },
          ],
          filter: {
            regija_id: {
              _eq: regijaId,
            },
          },
          sort: ["-date_created"],
          limit: limit || 20,
        })
      );

      // Then enhance with all related data
      const enhancedSmjestaji = await Promise.all(
        smjestaji.map(async (smjestaj) => {
          const rezervacije = await directus.request(
            readItems("rezervacije", {
              fields: ["*"],
              filter: {
                smjestaj_id: {
                  _eq: smjestaj.id,
                },
              },
              sort: ["datum_od"],
            })
          );

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

          const slikeSmjestaj = await directus.request(
            readItems("slike_smjestaj", {
              fields: ["*", { slika: ["*"] }],
              filter: {
                smjestaj_id: {
                  _eq: smjestaj.id,
                },
              },
              limit: -1,
            })
          );

          // Ensure each sadrzaj is fully populated
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

          return {
            ...smjestaj,
            smjestaj_sadrzaji: smjestajSadrzaji,
            slike_smjestaj: slikeSmjestaj,
            rezervacije: rezervacije,
          } as SmjestajWithRelations;
        })
      );

      return enhancedSmjestaji;
    } catch (error: unknown) {
      console.error(`Error getting smjestaji for regija ${regijaId}:`, error);
      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const message =
          apiError.errors?.[0]?.message ||
          apiError.message ||
          "Nepoznata greška";

        throw new Error(`Greška pri dohvaćanju smještaja: ${message}`);
      }
      throw new Error(
        `Nepoznata greška pri dohvaćanju smještaja za regiju ${regijaId}`
      );
    }
  },

  async getSmjestajiByTip(directus: Client, tipId: number, limit?: number) {
    try {
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
    } catch (error: unknown) {
      console.error(`Error getting smjestaji by tip ${tipId}:`, error);
      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const message =
          apiError.errors?.[0]?.message ||
          apiError.message ||
          "Nepoznata greška";

        throw new Error(`Greška pri dohvaćanju smještaja: ${message}`);
      }
      throw new Error(
        `Nepoznata greška pri dohvaćanju smještaja za tip ${tipId}`
      );
    }
  },

  async getSmjestajBySlug(directus: Client, slug: string) {
    try {
      const response = await directus.request(
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
      );

      return response && response.length > 0 ? response[0] : null;
    } catch (error: unknown) {
      console.error(`Error getting smjestaj by slug ${slug}:`, error);
      if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;
        const message =
          apiError.errors?.[0]?.message ||
          apiError.message ||
          "Nepoznata greška";

        throw new Error(`Greška pri dohvaćanju smještaja: ${message}`);
      }
      throw new Error(
        `Nepoznata greška pri dohvaćanju smještaja sa slug-om ${slug}`
      );
    }
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

  async getCompleteSmjestaji(
    directus: Client,
    limit?: number
  ): Promise<SmjestajWithRelations[]> {
    const smjestaji = await this.getSmjestaji(directus, limit);

    const enhancedSmjestaji = await Promise.all(
      smjestaji.map(async (smjestaj) => {
        const rezervacije = await directus.request(
          readItems("rezervacije", {
            fields: ["*"],
            filter: {
              smjestaj_id: {
                _eq: smjestaj.id,
              },
            },
            sort: ["datum_od"],
          })
        );

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

        let regija = smjestaj.regija;
        if (!regija && smjestaj.regija_id) {
          regija = await directus.request(
            readItem("regija", smjestaj.regija_id, {
              fields: ["*", { slika: ["*"] }],
            })
          );
        }

        let tipSmjestaja = smjestaj.tip_smjestaja;
        if (!tipSmjestaja && smjestaj.tipovi_smjestaja_id) {
          tipSmjestaja = await directus.request(
            readItem("tipovi_smjestaja", smjestaj.tipovi_smjestaja_id, {
              fields: ["*", { ikona: ["*"] }],
            })
          );
        }

        for (let i = 0; i < smjestajSadrzaji.length; i++) {
          if (!smjestajSadrzaji[i].sadrzaj && smjestajSadrzaji[i].sadrzaj_id) {
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

        return {
          ...smjestaj,
          regija: regija,
          tip_smjestaja: tipSmjestaja,
          smjestaj_sadrzaji: smjestajSadrzaji,

          rezervacije: rezervacije,
        } as unknown as SmjestajWithRelations;
      })
    );

    return enhancedSmjestaji;
  },

  async getCompleteSmjestaj(
    directus: Client,
    id: number
  ): Promise<SmjestajWithRelations> {
    const smjestaj = await this.getSmjestaj(directus, id);

    const slike = await directus.request(
      readItems("slike_smjestaj", {
        fields: ["*", { slika: ["*"] }],
        filter: {
          smjestaj_id: {
            _eq: id,
          },
        },
      })
    );

    const rezervacije = await directus.request(
      readItems("rezervacije", {
        fields: ["*"],
        filter: {
          smjestaj_id: {
            _eq: id,
          },
        },
        sort: ["datum_od"],
      })
    );

    const smjestajSadrzaji = await directus.request(
      readItems("smjestaj_sadrzaji", {
        fields: ["*", { sadrzaj: ["*", { icon: ["*"] }] }],
        filter: {
          smjestaj_id: {
            _eq: id,
          },
        },
      })
    );

    return {
      ...smjestaj,
      smjestaj_sadrzaji: smjestajSadrzaji,
      slike_smjestaj: slike,
      rezervacije: rezervacije,
    } as unknown as SmjestajWithRelations;
  },

  async getCompleteSmjestajBySlug(
    directus: Client,
    slug: string
  ): Promise<SmjestajWithRelations | null> {
    const smjestaj = await this.getSmjestajBySlug(directus, slug);

    if (!smjestaj) {
      return null;
    }

    const slike = await directus.request(
      readItems("slike_smjestaj", {
        fields: ["*", { slika: ["*"] }],
        filter: {
          smjestaj_id: {
            _eq: smjestaj.id,
          },
        },
        limit: -1,
      })
    );

    const rezervacije = await directus.request(
      readItems("rezervacije", {
        fields: ["*"],
        filter: {
          smjestaj_id: {
            _eq: smjestaj.id,
          },
        },
        sort: ["datum_od"],
      })
    );

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

    let regija = smjestaj.regija;
    if (!regija && smjestaj.regija_id) {
      regija = await directus.request(
        readItem("regija", smjestaj.regija_id, {
          fields: ["*", { slika: ["*"] }],
        })
      );
    }

    let tipSmjestaja = smjestaj.tip_smjestaja;
    if (!tipSmjestaja && smjestaj.tipovi_smjestaja_id) {
      tipSmjestaja = await directus.request(
        readItem("tipovi_smjestaja", smjestaj.tipovi_smjestaja_id, {
          fields: ["*", { ikona: ["*"] }],
        })
      );
    }

    for (let i = 0; i < smjestajSadrzaji.length; i++) {
      if (!smjestajSadrzaji[i].sadrzaj && smjestajSadrzaji[i].sadrzaj_id) {
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

    return {
      ...smjestaj,
      regija: regija,
      tip_smjestaja: tipSmjestaja,
      smjestaj_sadrzaji: smjestajSadrzaji,
      slike_smjestaj: slike,
      rezervacije: rezervacije,
    } as SmjestajWithRelations;
  },

  async getSlikeSmjestaja(directus: Client, smjestajId: number) {
    return await directus.request(
      readItems("slike_smjestaj", {
        fields: ["*", { slika: ["*"] }],
        filter: {
          smjestaj_id: {
            _eq: smjestajId,
          },
        },
      })
    );
  },

  async getRezervacijeSmjestaja(directus: Client, smjestajId: number) {
    return await directus.request(
      readItems("rezervacije", {
        fields: ["*"],
        filter: {
          smjestaj_id: {
            _eq: smjestajId,
          },
        },
        sort: ["datum_od"],
      })
    );
  },

  async provjeriDostupnost(
    directus: Client,
    smjestajId: number,
    datumOd: string,
    datumDo: string
  ): Promise<boolean> {
    const response = await directus.request(
      readItems("rezervacije", {
        filter: {
          smjestaj_id: {
            _eq: smjestajId,
          },
          _or: [
            {
              datum_od: {
                _between: [datumOd, datumDo],
              },
            },

            {
              datum_do: {
                _between: [datumOd, datumDo],
              },
            },

            {
              _and: [
                {
                  datum_od: {
                    _lte: datumOd,
                  },
                },
                {
                  datum_do: {
                    _gte: datumDo,
                  },
                },
              ],
            },
          ],
        },
      })
    );

    return response.length === 0;
  },
};
