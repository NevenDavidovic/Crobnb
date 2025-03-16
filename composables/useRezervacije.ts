import type { Rezervacija, Smjestaj } from "~/types/directus";
import type { SearchFilters } from "~/types/pages/search-filter";

export const useRezervacije = () => {
  const {
    $getRezervacije,
    $getAvailableSmjestaji,
    $checkSmjestajAvailability,
  } = useNuxtApp();

  const rezervacije = ref<Rezervacija[]>([]);
  const availableSmjestaji = ref<Smjestaj[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const normalizeDate = (dateString: string): string => {
    return dateString ? dateString.replace(/\.$/, "") : "";
  };

  const fetchRezervacije = async (filters?: Partial<SearchFilters>) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (filters?.checkin) filters.checkin = normalizeDate(filters.checkin);
      if (filters?.checkout) filters.checkout = normalizeDate(filters.checkout);

      const response = await $getRezervacije(filters);
      rezervacije.value = response;
    } catch (err) {
      console.error("Error fetching rezervacije:", err);
      error.value = "Failed to load reservations";

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAvailableSmjestaji = async (filters: SearchFilters) => {
    isLoading.value = true;
    error.value = null;

    try {
      filters.checkin = normalizeDate(filters.checkin);
      filters.checkout = normalizeDate(filters.checkout);

      const response = await $getAvailableSmjestaji(filters);
      availableSmjestaji.value = response;

      console.log(`Found ${response.length} available accommodations`);
    } catch (err) {
      console.error("Error fetching available smjestaji:", err);
      error.value = "Failed to load available accommodations";

      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const checkSmjestajAvailability = async (
    smjestajId: number,
    checkin: string,
    checkout: string
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
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

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const parseDateFromString = (dateString: string): Date => {
    const [day, month, year] = dateString.replace(/\.$/, "").split(".");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

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
    rezervacije,
    availableSmjestaji,
    isLoading,
    error,

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
