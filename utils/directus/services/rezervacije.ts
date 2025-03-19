import { readItems } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema } from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const RezervacijeService = {
  normalizeDate(dateString: string): string {
    return dateString ? dateString.replace(/\.$/, "") : "";
  },

  async getRezervacije(directus: Client, filters?: Partial<SearchFilters>) {
    const queryFilter: Record<string, any> = {};

    if (filters?.checkin && filters?.checkout) {
      queryFilter.datum_od = {
        _lte: this.normalizeDate(filters.checkout),
      };
      queryFilter.datum_do = {
        _gte: this.normalizeDate(filters.checkin),
      };
    }

    if (filters?.location) {
      queryFilter["smjestaj.regija.slug"] = { _eq: filters.location };
    }

    if (filters?.type) {
      queryFilter["smjestaj.tip_smjestaja.slug"] = { _eq: filters.type };
    }

    try {
      const response = await directus.request(
        readItems("rezervacije", {
          fields: [
            "*",
            {
              smjestaj: [
                "*",
                { thumbnail: ["*"] },
                { regija: ["*"] },
                { tip_smjestaja: ["*"] },
              ],
            },
          ],
          filter: queryFilter,
        })
      );

      console.log("Reservation Response:", response.length);
      return response;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  },

  async getAvailableSmjestaji(directus: Client, filters: SearchFilters) {
    try {
      const overlappingRezervacije = await this.getRezervacije(
        directus,
        filters
      );

      const occupiedSmjestajIds = new Set(
        overlappingRezervacije
          .map((rez) => rez.smjestaj_id)
          .filter((id): id is number => id !== undefined)
      );

      const availableSmjestajiFilter: Record<string, any> = {
        ...(occupiedSmjestajIds.size > 0
          ? { id: { _nin: Array.from(occupiedSmjestajIds) } }
          : {}),
      };

      if (filters.location) {
        availableSmjestajiFilter["regija.slug"] = { _eq: filters.location };
      }

      if (filters.type) {
        availableSmjestajiFilter["tip_smjestaja.slug"] = { _eq: filters.type };
      }

      console.log(
        "Available Smjestaji Filters:",
        JSON.stringify(availableSmjestajiFilter, null, 2)
      );

      const response = await directus.request(
        readItems("smjestaj", {
          fields: [
            "*",
            { thumbnail: ["*"] },
            { regija: ["*", { slika: ["*"] }] },
            { tip_smjestaja: ["*", { ikona: ["*"] }] },
            { sadrzaji: ["*", { sadrzaj: ["*", { icon: ["*"] }] }] },
          ],
          filter: availableSmjestajiFilter,
          sort: ["-date_created"],
        })
      );

      console.log("Available Smjestaji Response:", response.length);
      return response;
    } catch (error) {
      console.error("Error fetching available smjestaji:", error);
      throw error;
    }
  },

  async checkSmjestajAvailability(
    directus: Client,
    smjestajId: number,
    checkin: string,
    checkout: string
  ) {
    try {
      const overlappingRezervacije = await this.getRezervacije(directus, {
        checkin: this.normalizeDate(checkin),
        checkout: this.normalizeDate(checkout),
        location: "",
        type: "",
        adults: "",
        children: "",
      });

      const isAvailable = !overlappingRezervacije.some(
        (rez) => rez.smjestaj_id === smjestajId
      );

      return {
        isAvailable,
        overlappingReservations: overlappingRezervacije,
      };
    } catch (error) {
      console.error("Error checking smjestaj availability:", error);
      throw error;
    }
  },
};
