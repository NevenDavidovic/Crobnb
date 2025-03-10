// composables/useSmjestaji.ts
import { ref } from "vue";
import type {
  Smjestaj,
  Sadrzaj,
  SmjestajSadrzaj,
  Rezervacija,
  SlikaSmjestaj,
  SmjestajWithRelations,
} from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";

export const useSmjestaji = () => {
  const {
    // Basic methods
    $getSmjestaji,
    $getSmjestaj,
    $getSmjestajiByRegija,
    $getSmjestajiByTip,
    $getSmjestajBySlug,
    $getSadrzaji,
    $getSmjestajSadrzajiRelations,
    $getFileUrl,
    $getSmjestajiByCity,

    // Complete methods
    $getCompleteSmjestaji,
    $getCompleteSmjestaj,
    $getCompleteSmjestajBySlug,

    // Specific relations
    $getSlikeSmjestaja,
    $getRezervacijeSmjestaja,
    $provjeriDostupnost,

    // Reservation methods
    $getRezervacije,
    $getAvailableSmjestaji,
    $checkSmjestajAvailability,
  } = useNuxtApp();

  // Reactive state
  const smjestaji = ref<Smjestaj[]>([]);
  const completeSmjestaji = ref<SmjestajWithRelations[]>([]);
  const availableSmjestaji = ref<Smjestaj[]>([]);
  const currentSmjestaj = ref<Smjestaj | null>(null);
  const currentCompleteSmjestaj = ref<SmjestajWithRelations | null>(null);
  const sadrzaji = ref<Sadrzaj[]>([]);
  const sadrzajRelations = ref<SmjestajSadrzaj[]>([]);
  const slikeSmjestaja = ref<SlikaSmjestaj[]>([]);
  const rezervacije = ref<Rezervacija[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isSmjestajAvailable = ref<boolean>(true);

  // Utility methods for formatting and display
  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} EUR`;
  };

  const fetchSmjestajiByCity = async (city: string, limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSmjestajiByCity(city, limit)) as Smjestaj[];
      smjestaji.value = response;
      availableSmjestaji.value = response;
      isLoading.value = false;
      return response;
    } catch (err) {
      console.error(`Error fetching smjestaji for city "${city}":`, err);
      error.value = `Failed to load accommodation listings for ${city}`;
      isLoading.value = false;
      return [];
    }
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return "";

    // If the timeString is already in the format you want (like "12:00")
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // If the timeString is in format "12:00:00"
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString.substring(0, 5);
    }

    // If the timeString is a full date-time string
    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return (
          date.getHours().toString().padStart(2, "0") +
          ":" +
          date.getMinutes().toString().padStart(2, "0")
        );
      }
    } catch (e) {
      console.error("Error parsing time:", e);
    }

    // If all else fails, return the original string
    return timeString;
  };

  const convertToHRK = (priceEUR: number): number => {
    // Fixed conversion rate (Euro to Croatian Kuna)
    const conversionRate = 7.5345;
    const result = priceEUR * conversionRate;
    return result;
  };

  const formatPriceHRK = (priceEUR: number): string => {
    const priceHRK = convertToHRK(priceEUR);
    return `${priceHRK.toFixed(2)} HRK`;
  };

  // Basic accommodation methods
  const fetchSmjestaji = async (limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSmjestaji(limit)) as Smjestaj[];
      smjestaji.value = response;
      availableSmjestaji.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching smjestaji:", err);
      error.value = "Failed to load accommodation listings";
      isLoading.value = false;
    }
  };

  // Complete accommodation data including all relations
  const fetchCompleteSmjestaji = async (limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getCompleteSmjestaji(
        limit
      )) as SmjestajWithRelations[];
      completeSmjestaji.value = response;
      // Also update basic smjestaji for compatibility
      smjestaji.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching complete smjestaji:", err);
      error.value = "Failed to load complete accommodation listings";
      isLoading.value = false;
    }
  };

  const fetchSmjestajiByRegija = async (regijaId: number, limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSmjestajiByRegija(
        regijaId,
        limit
      )) as Smjestaj[];
      console.log(`Smjestaji for region ${regijaId}:`, response.length);
      smjestaji.value = response;
      availableSmjestaji.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaji by regija ${regijaId}:`, err);
      error.value = "Failed to load accommodation listings for this region";
      isLoading.value = false;
    }
  };

  const fetchSmjestajiByTip = async (tipId: number, limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSmjestajiByTip(tipId, limit)) as Smjestaj[];
      console.log(`Smjestaji for type ${tipId}:`, response.length);
      smjestaji.value = response;
      availableSmjestaji.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaji by tip ${tipId}:`, err);
      error.value = "Failed to load accommodation listings for this type";
      isLoading.value = false;
    }
  };

  const fetchSmjestaj = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSmjestaj(id)) as Smjestaj;
      currentSmjestaj.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaj with ID ${id}:`, err);
      error.value = "Failed to load accommodation details";
      isLoading.value = false;
    }
  };

  // Complete accommodation with all relations
  const fetchCompleteSmjestaj = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getCompleteSmjestaj(
        id
      )) as SmjestajWithRelations;
      currentCompleteSmjestaj.value = response;
      // Also update basic currentSmjestaj for compatibility
      currentSmjestaj.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching complete smjestaj with ID ${id}:`, err);
      error.value = "Failed to load accommodation details";
      isLoading.value = false;
    }
  };

  const fetchSmjestajBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSmjestajBySlug(slug)) as Smjestaj | null;
      if (!response) {
        error.value = "Accommodation not found";
        currentSmjestaj.value = null;
      } else {
        currentSmjestaj.value = response;
      }
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaj with slug ${slug}:`, err);
      error.value = "Failed to load accommodation details";
      isLoading.value = false;
    }
  };

  // Complete accommodation by slug with all relations
  const fetchCompleteSmjestajBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getCompleteSmjestajBySlug(
        slug
      )) as SmjestajWithRelations | null;
      if (!response) {
        error.value = "Accommodation not found";
        currentCompleteSmjestaj.value = null;
        currentSmjestaj.value = null;
      } else {
        currentCompleteSmjestaj.value = response;
        // Also update basic currentSmjestaj for compatibility
        currentSmjestaj.value = response;
      }
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching complete smjestaj with slug ${slug}:`, err);
      error.value = "Failed to load accommodation details";
      isLoading.value = false;
    }
  };

  // Fetch amenities (sadrzaji)
  const fetchSadrzaji = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getSadrzaji()) as Sadrzaj[];
      sadrzaji.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching sadrzaji:", err);
      error.value = "Failed to load amenities";
      isLoading.value = false;
    }
  };

  // Fetch specific relations
  const fetchSmjestajSadrzajiRelations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await fetchSadrzaji();
      if (smjestaji.value.length === 0) {
        await fetchSmjestaji();
      }

      const relations =
        (await $getSmjestajSadrzajiRelations()) as SmjestajSadrzaj[];
      sadrzajRelations.value = relations;

      // Update existing smjestaji objects with their related sadrzaji
      const relationsBySmjestajId: Record<number, SmjestajSadrzaj[]> = {};
      relations.forEach((relation: SmjestajSadrzaj) => {
        if (!relationsBySmjestajId[relation.smjestaj_id]) {
          relationsBySmjestajId[relation.smjestaj_id] = [];
        }
        relationsBySmjestajId[relation.smjestaj_id].push(relation);
      });

      smjestaji.value = smjestaji.value.map((smjestaj) => {
        const smjestajRelations = relationsBySmjestajId[smjestaj.id] || [];
        const smjestajSadrzaji: SmjestajSadrzaj[] = smjestajRelations.map(
          (relation: SmjestajSadrzaj) => {
            const sadrzajItem = sadrzaji.value.find(
              (s) => s.id === relation.sadrzaj_id
            );

            if (!sadrzajItem) {
              console.log(
                `Warning: Sadrzaj ID ${relation.sadrzaj_id} not found in loaded sadrzaji list`
              );
            }

            return {
              id: relation.id,
              sadrzaj_id: relation.sadrzaj_id,
              smjestaj_id: relation.smjestaj_id,
              sadrzaj: sadrzajItem || relation.sadrzaj,
            };
          }
        );

        return {
          ...smjestaj,
          sadrzaji: smjestajSadrzaji,
        };
      });

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching sadrzaji relations:", err);
      error.value = "Failed to load amenity relations";
      isLoading.value = false;
    }
  };

  // Fetch images for a specific accommodation
  const fetchSlikeSmjestaja = async (smjestajId: number) => {
    try {
      const slike = await $getSlikeSmjestaja(smjestajId);
      slikeSmjestaja.value = slike;
      return slike;
    } catch (err) {
      console.error(
        `Error fetching images for smjestaj ID ${smjestajId}:`,
        err
      );
      return [];
    }
  };

  // Fetch reservations for a specific accommodation
  const fetchRezervacijeSmjestaja = async (smjestajId: number) => {
    try {
      const rezervacijeData = await $getRezervacijeSmjestaja(smjestajId);
      rezervacije.value = rezervacijeData;
      return rezervacijeData;
    } catch (err) {
      console.error(
        `Error fetching reservations for smjestaj ID ${smjestajId}:`,
        err
      );
      return [];
    }
  };

  // Check availability for a specific accommodation in date range
  const provjeriDostupnost = async (
    smjestajId: number,
    datumOd: string,
    datumDo: string
  ) => {
    try {
      const isAvailable = await $provjeriDostupnost(
        smjestajId,
        datumOd,
        datumDo
      );
      isSmjestajAvailable.value = isAvailable;
      return isAvailable;
    } catch (err) {
      console.error(
        `Error checking availability for smjestaj ID ${smjestajId}:`,
        err
      );
      isSmjestajAvailable.value = false;
      return false;
    }
  };

  // Fetch available accommodations based on filters
  const fetchAvailableSmjestaji = async (filters: SearchFilters) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getAvailableSmjestaji(filters);
      availableSmjestaji.value = response;
      // Also update the main smjestaji ref to show only available accommodations
      smjestaji.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching available smjestaji:", err);
      error.value = "Failed to load available accommodations";
      isLoading.value = false;
    }
  };

  // Check detailed availability info for an accommodation
  const checkSmjestajAvailability = async (
    smjestajId: number,
    checkin: string,
    checkout: string
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await $checkSmjestajAvailability(
        smjestajId,
        checkin,
        checkout
      );

      isSmjestajAvailable.value = result.isAvailable;
      return result;
    } catch (err) {
      console.error(
        `Error checking availability for smjestaj ID ${smjestajId}:`,
        err
      );
      error.value = "Failed to check accommodation availability";
      isLoading.value = false;
      return { isAvailable: false, overlappingReservations: [] };
    } finally {
      isLoading.value = false;
    }
  };

  // Utility functions for UI
  const getThumbnailUrl = (smjestaj: Smjestaj): string | null => {
    if (!smjestaj.thumbnail) return null;
    return $getFileUrl(smjestaj.thumbnail);
  };

  const getSlikaUrl = (slika: any): string | null => {
    if (!slika) return null;
    return $getFileUrl(slika);
  };

  const getFullAddress = (smjestaj: Smjestaj): string => {
    const address = `${smjestaj.adresa}, ${smjestaj.postanski_broj} ${
      smjestaj.grad
    }, ${smjestaj.regija?.naziv || "Hrvatska"}`;
    return address;
  };

  const hasAmenity = (
    smjestaj: SmjestajWithRelations,
    amenityId: number
  ): boolean => {
    if (
      !smjestaj.smjestaj_sadrzaji ||
      !Array.isArray(smjestaj.smjestaj_sadrzaji)
    ) {
      return false;
    }

    return smjestaj.smjestaj_sadrzaji.some(
      (item) =>
        item.sadrzaj_id === amenityId ||
        (item.sadrzaj && item.sadrzaj.id === amenityId)
    );
  };

  const getSadrzajIconUrl = (sadrzaj: Sadrzaj | undefined): string | null => {
    if (!sadrzaj || !sadrzaj.icon) return null;
    return $getFileUrl(sadrzaj.icon);
  };

  // Helper to parse URL search params for filtering
  const parseSearchParams = (): SearchFilters => {
    const route = useRoute();
    const params = route.query;

    return {
      location: (params.location as string) || "",
      type: (params.type as string) || "",
      checkin: (params.checkin as string) || "",
      checkout: (params.checkout as string) || "",
      adults: (params.adults as string) || "",
      children: (params.children as string) || "",
    };
  };

  return {
    // State
    smjestaji,
    completeSmjestaji,
    availableSmjestaji,
    currentSmjestaj,
    currentCompleteSmjestaj,
    sadrzaji,
    sadrzajRelations,
    slikeSmjestaja,
    rezervacije,
    isLoading,
    error,
    isSmjestajAvailable,

    // Basic methods
    fetchSmjestaji,
    fetchSmjestajiByRegija,
    fetchSmjestajiByTip,
    fetchSmjestaj,
    fetchSmjestajBySlug,
    fetchSmjestajiByCity,

    // Complete methods with relations
    fetchCompleteSmjestaji,
    fetchCompleteSmjestaj,
    fetchCompleteSmjestajBySlug,

    // Specific relation methods
    fetchSmjestajSadrzajiRelations,
    fetchSadrzaji,
    fetchSlikeSmjestaja,
    fetchRezervacijeSmjestaja,
    provjeriDostupnost,

    // Availability methods
    fetchAvailableSmjestaji,
    checkSmjestajAvailability,

    // Utility methods
    parseSearchParams,
    formatPrice,
    formatPriceHRK,
    getThumbnailUrl,
    getSlikaUrl,
    getFullAddress,
    hasAmenity,
    getSadrzajIconUrl,
    formatTime,
  };
};
