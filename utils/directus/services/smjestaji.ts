// smjestaji.ts
import { readItems, readItem } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";
import type { SmjestajWithRelations } from "~/types/directus/exports/all_data_smjestaj_interface";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const SmjestajiService = {
  // Keep all your existing methods
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

  async getSmjestajiByCity(directus: Client, city: string, limit?: number) {
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

    // Step 2: If the tip_smjestaja relation isn't populating, we need to manually fetch and attach them
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

  // New methods to get complete accommodation data with all relationships
  async getCompleteSmjestaji(
    directus: Client,
    limit?: number
  ): Promise<SmjestajWithRelations[]> {
    // First get basic accommodation data
    const smjestaji = await this.getSmjestaji(directus, limit);

    // For each accommodation, fetch the additional related data
    const enhancedSmjestaji = await Promise.all(
      smjestaji.map(async (smjestaj) => {
        // Get rezervacije (reservations)
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

        // Get smjestaj_sadrzaji (amenities through junction table) with complete sadrzaj info
        // Add limit: -1 to ensure all items are returned
        const smjestajSadrzaji = await directus.request(
          readItems("smjestaj_sadrzaji", {
            fields: ["*", { sadrzaj: ["*", { icon: ["*"] }] }],
            filter: {
              smjestaj_id: {
                _eq: smjestaj.id,
              },
            },
            limit: -1, // This ensures all items are returned
          })
        );

        // Add this after the query
        console.log(
          `Sadrzaji for smjestaj ${smjestaj.id}:`,
          JSON.stringify(smjestajSadrzaji, null, 2)
        );

        // Manually fetch regija if it's not already included
        let regija = smjestaj.regija;
        if (!regija && smjestaj.regija_id) {
          regija = await directus.request(
            readItem("regija", smjestaj.regija_id, {
              fields: ["*", { slika: ["*"] }],
            })
          );
        }

        // Manually fetch tip_smjestaja if it's not already included
        let tipSmjestaja = smjestaj.tip_smjestaja;
        if (!tipSmjestaja && smjestaj.tipovi_smjestaja_id) {
          tipSmjestaja = await directus.request(
            readItem("tipovi_smjestaja", smjestaj.tipovi_smjestaja_id, {
              fields: ["*", { ikona: ["*"] }],
            })
          );
        }

        // Check for missing sadrzaj in smjestaj_sadrzaji
        for (let i = 0; i < smjestajSadrzaji.length; i++) {
          if (!smjestajSadrzaji[i].sadrzaj && smjestajSadrzaji[i].sadrzaj_id) {
            // Fetch the missing sadrzaj
            const sadrzaj = await directus.request(
              readItem("sadrzaji", smjestajSadrzaji[i].sadrzaj_id, {
                fields: ["*", { icon: ["*"] }],
              })
            );

            // Update the object with the fetched sadrzaj
            smjestajSadrzaji[i] = {
              ...smjestajSadrzaji[i],
              sadrzaj: sadrzaj,
            };
          }
        }

        // Combine all data into SmjestajWithRelations format
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
    // Get basic accommodation data
    const smjestaj = await this.getSmjestaj(directus, id);

    // Get slike_smjestaj (images)
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

    // Get rezervacije (reservations)
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

    // Get smjestaj_sadrzaji (amenities through junction table)
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

    // Combine all data into SmjestajWithRelations format
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
    // Get basic accommodation data by slug
    const smjestaj = await this.getSmjestajBySlug(directus, slug);

    if (!smjestaj) {
      return null;
    }

    // Get slike_smjestaj (images)
    const slike = await directus.request(
      readItems("slike_smjestaj", {
        fields: ["*", { slika: ["*"] }],
        filter: {
          smjestaj_id: {
            _eq: smjestaj.id,
          },
        },
        limit: -1, // Ensure all images are returned
      })
    );

    // Get rezervacije (reservations)
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

    // Get smjestaj_sadrzaji (amenities through junction table)
    const smjestajSadrzaji = await directus.request(
      readItems("smjestaj_sadrzaji", {
        fields: ["*", { sadrzaj: ["*", { icon: ["*"] }] }],
        filter: {
          smjestaj_id: {
            _eq: smjestaj.id,
          },
        },
        limit: -1, // Ensure all amenities are returned
      })
    );

    // Manually fetch regija if it's not already included
    let regija = smjestaj.regija;
    if (!regija && smjestaj.regija_id) {
      regija = await directus.request(
        readItem("regija", smjestaj.regija_id, {
          fields: ["*", { slika: ["*"] }],
        })
      );
    }

    // Manually fetch tip_smjestaja if it's not already included
    let tipSmjestaja = smjestaj.tip_smjestaja;
    if (!tipSmjestaja && smjestaj.tipovi_smjestaja_id) {
      tipSmjestaja = await directus.request(
        readItem("tipovi_smjestaja", smjestaj.tipovi_smjestaja_id, {
          fields: ["*", { ikona: ["*"] }],
        })
      );
    }

    // Check for missing sadrzaj in smjestaj_sadrzaji
    for (let i = 0; i < smjestajSadrzaji.length; i++) {
      if (!smjestajSadrzaji[i].sadrzaj && smjestajSadrzaji[i].sadrzaj_id) {
        // Fetch the missing sadrzaj
        const sadrzaj = await directus.request(
          readItem("sadrzaji", smjestajSadrzaji[i].sadrzaj_id, {
            fields: ["*", { icon: ["*"] }],
          })
        );

        // Update the object with the fetched sadrzaj
        smjestajSadrzaji[i] = {
          ...smjestajSadrzaji[i],
          sadrzaj: sadrzaj,
        };
      }
    }

    // Combine all data into SmjestajWithRelations format
    return {
      ...smjestaj,
      regija: regija,
      tip_smjestaja: tipSmjestaja,
      smjestaj_sadrzaji: smjestajSadrzaji,
      slike_smjestaj: slike,
      rezervacije: rezervacije,
    } as SmjestajWithRelations;
  },

  // Helper methods for specific tables
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
            // Check if a reservation starts during the requested period
            {
              datum_od: {
                _between: [datumOd, datumDo],
              },
            },
            // Check if a reservation ends during the requested period
            {
              datum_do: {
                _between: [datumOd, datumDo],
              },
            },
            // Check if a reservation completely spans the requested period
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

    // If no conflicting reservations found, the accommodation is available
    return response.length === 0;
  },
};
