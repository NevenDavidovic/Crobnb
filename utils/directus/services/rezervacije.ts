import { readItems } from "@directus/sdk";
import type {
  DirectusClient,
  RestClient,
  AuthenticationClient,
} from "@directus/sdk";
import type { Schema, Rezervacija, Smjestaj } from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";

type Client = DirectusClient<Schema> &
  RestClient<Schema> &
  AuthenticationClient<Schema>;

export const RezervacijeService = {
  /**
   * Normalize date string by removing trailing dot
   * @param dateString Date string to normalize
   * @returns Normalized date string
   */
  normalizeDate(dateString: string): string {
    return dateString ? dateString.replace(/\.$/, "") : "";
  },

  /**
   * Fetch reservations with optional filtering
   * @param directus Directus client instance
   * @param filters Search filters
   * @returns Promise with reservations
   */
  async getRezervacije(directus: Client, filters?: Partial<SearchFilters>) {
    const queryFilter: Record<string, any> = {};

    // If checkin and checkout are provided, filter for overlapping reservations
    if (filters?.checkin && filters?.checkout) {
      queryFilter.datum_od = {
        _lte: this.normalizeDate(filters.checkout),
      };
      queryFilter.datum_do = {
        _gte: this.normalizeDate(filters.checkin),
      };
    }

    // Add additional filters if needed
    if (filters?.location) {
      queryFilter["smjestaj.regija.slug"] = { _eq: filters.location };
    }

    if (filters?.type) {
      queryFilter["smjestaj.tip_smjestaja.slug"] = { _eq: filters.type };
    }

    console.log(
      "Reservation Query Filters:",
      JSON.stringify(queryFilter, null, 2)
    );

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

  /**
   * Find available accommodations based on search filters
   * @param directus Directus client instance
   * @param filters Search filters
   * @returns Promise with available accommodations
   */
  async getAvailableSmjestaji(directus: Client, filters: SearchFilters) {
    try {
      // First, get all reservations that overlap with the requested dates
      const overlappingRezervacije = await this.getRezervacije(
        directus,
        filters
      );

      // Create a set of occupied smjestaj IDs
      const occupiedSmjestajIds = new Set(
        overlappingRezervacije
          .map((rez) => rez.smjestaj_id)
          .filter((id): id is number => id !== undefined)
      );

      // Prepare filter for available accommodations
      const availableSmjestajiFilter: Record<string, any> = {
        ...(occupiedSmjestajIds.size > 0
          ? { id: { _nin: Array.from(occupiedSmjestajIds) } }
          : {}),
      };

      // Add location filter if provided
      if (filters.location) {
        availableSmjestajiFilter["regija.slug"] = { _eq: filters.location };
      }

      // Add type filter if provided
      if (filters.type) {
        availableSmjestajiFilter["tip_smjestaja.slug"] = { _eq: filters.type };
      }

      console.log(
        "Available Smjestaji Filters:",
        JSON.stringify(availableSmjestajiFilter, null, 2)
      );

      // Fetch available accommodations
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

  /**
   * Check availability of a specific accommodation
   * @param directus Directus client instance
   * @param smjestajId Accommodation ID to check
   * @param checkin Check-in date
   * @param checkout Check-out date
   * @returns Availability information
   */
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

      // Check if any reservations overlap with the requested dates for this specific smjestaj
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
