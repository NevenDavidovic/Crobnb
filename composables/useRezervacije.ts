import type { Rezervacija, Smjestaj } from "~/types/directus";
import type { SearchFilters } from "~/types/pages/search-filter";

export const useRezervacije = () => {
  const {
    $getRezervacije,
    $getAvailableSmjestaji,
    $checkSmjestajAvailability,
  } = useNuxtApp();

  // Reactive state
  const rezervacije = ref<Rezervacija[]>([]);
  const availableSmjestaji = ref<Smjestaj[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Normalize date string
   * @param dateString Date string to normalize
   * @returns Normalized date string
   */
  const normalizeDate = (dateString: string): string => {
    return dateString ? dateString.replace(/\.$/, "") : "";
  };

  /**
   * Fetch reservations based on filters
   * @param filters Partial search filters
   */
  const fetchRezervacije = async (filters?: Partial<SearchFilters>) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Normalize date filters if present
      if (filters?.checkin) filters.checkin = normalizeDate(filters.checkin);
      if (filters?.checkout) filters.checkout = normalizeDate(filters.checkout);

      const response = await $getRezervacije(filters);
      rezervacije.value = response;
    } catch (err) {
      console.error("Error fetching rezervacije:", err);
      error.value = "Failed to load reservations";
      // Rethrow to allow caller to handle the error
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Find available accommodations based on search filters
   * @param filters Search filters
   */
  const fetchAvailableSmjestaji = async (filters: SearchFilters) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Normalize date filters
      filters.checkin = normalizeDate(filters.checkin);
      filters.checkout = normalizeDate(filters.checkout);

      const response = await $getAvailableSmjestaji(filters);
      availableSmjestaji.value = response;

      // Log the number of available accommodations
      console.log(`Found ${response.length} available accommodations`);
    } catch (err) {
      console.error("Error fetching available smjestaji:", err);
      error.value = "Failed to load available accommodations";
      // Rethrow to allow caller to handle the error
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Check availability of a specific accommodation
   * @param smjestajId Accommodation ID
   * @param checkin Check-in date
   * @param checkout Check-out date
   */
  const checkSmjestajAvailability = async (
    smjestajId: number,
    checkin: string,
    checkout: string
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Normalize dates
      const normalizedCheckin = normalizeDate(checkin);
      const normalizedCheckout = normalizeDate(checkout);

      return await $checkSmjestajAvailability(
        smjestajId,
        normalizedCheckin,
        normalizedCheckout
      );
    } catch (err) {
      console.error("Error checking smjestaj availability:", err);
      error.value = "Failed to check accommodation availability";
      return { isAvailable: false };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Parse URL query parameters to SearchFilters
   * @param route Current route
   * @returns Parsed search filters
   */
  const parseUrlParams = (route: any): SearchFilters => {
    const query = route.query;

    return {
      location: (query.location as string) || "",
      type: (query.type as string) || "",
      checkin: normalizeDate(query.checkin as string) || "",
      checkout: normalizeDate(query.checkout as string) || "",
      adults: (query.adults as string) || "2",
      children: (query.children as string) || "0",
    };
  };

  /**
   * Format date to ISO string
   * @param date Date to format
   * @returns Formatted date string
   */
  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  /**
   * Parse date from DD.MM.YYYY format
   * @param dateString Date string to parse
   * @returns Parsed Date object
   */
  const parseDateFromString = (dateString: string): Date => {
    const [day, month, year] = dateString.replace(/\.$/, "").split(".");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  /**
   * Format date to DD.MM.YYYY
   * @param date Date to format
   * @returns Formatted date string
   */
  const formatDateToDDMMYYYY = (date: Date): string => {
    return date
      .toLocaleDateString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\./g, ".");
  };

  return {
    // Reactive state
    rezervacije,
    availableSmjestaji,
    isLoading,
    error,

    // Methods
    fetchRezervacije,
    fetchAvailableSmjestaji,
    checkSmjestajAvailability,
    parseUrlParams,
    formatDateToISO,
    parseDateFromString,
    formatDateToDDMMYYYY,
    normalizeDate,
  };
};
