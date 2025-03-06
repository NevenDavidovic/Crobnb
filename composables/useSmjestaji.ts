import type {
  Smjestaj,
  Sadrzaj,
  SmjestajSadrzaj,
} from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";

export const useSmjestaji = () => {
  const {
    $getSmjestaji,
    $getSmjestaj,
    $getSmjestajiByRegija,
    $getSmjestajiByTip,
    $getSmjestajBySlug,
    $getSadrzaji,
    $getFileUrl,
    $getSmjestajSadrzajiRelations,
    // Use these provided methods instead of RezervacijeService
    $getRezervacije,
    $getAvailableSmjestaji,
    $checkSmjestajAvailability,
  } = useNuxtApp();

  const smjestaji = ref<Smjestaj[]>([]);
  const availableSmjestaji = ref<Smjestaj[]>([]);
  const currentSmjestaj = ref<Smjestaj | null>(null);
  const sadrzaji = ref<Sadrzaj[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isSmjestajAvailable = ref<boolean>(true);

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} EUR`;
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

  const fetchSmjestajSadrzajiRelations = async () => {
    isLoading.value = true;

    try {
      await fetchSadrzaji();

      if (smjestaji.value.length === 0) {
        await fetchSmjestaji();
      }

      const relations =
        (await $getSmjestajSadrzajiRelations()) as SmjestajSadrzaj[];

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
    } catch (error) {
      console.error("Error fetching sadrzaji relations:", error);
      isLoading.value = false;
    }
  };

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

  // Updated to use plugin-provided method
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

  // Updated to use plugin-provided method
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

  const getThumbnailUrl = (smjestaj: Smjestaj): string | null => {
    if (!smjestaj.thumbnail) return null;
    const url = $getFileUrl(smjestaj.thumbnail);
    return url;
  };

  const getFullAddress = (smjestaj: Smjestaj): string => {
    const address = `${smjestaj.adresa}, ${smjestaj.postanski_broj} ${
      smjestaj.grad
    }, ${smjestaj.regija?.naziv || "Hrvatska"}`;
    return address;
  };

  const hasAmenity = (smjestaj: Smjestaj, amenityId: number): boolean => {
    if (!smjestaj.sadrzaji) return false;

    const result = smjestaj.sadrzaji.some((item) => {
      return (
        item.sadrzaj_id === amenityId ||
        (item.sadrzaj && item.sadrzaj.id === amenityId)
      );
    });

    return result;
  };

  const getSadrzajIconUrl = (sadrzaj: Sadrzaj | undefined): string | null => {
    if (!sadrzaj || !sadrzaj.icon) return null;
    const url = $getFileUrl(sadrzaj.icon);

    return url;
  };

  const getSmjestajSadrzaji = (smjestaj: Smjestaj): Sadrzaj[] => {
    if (!smjestaj.sadrzaji) return [];

    const result = smjestaj.sadrzaji
      .map((item) => {
        return item.sadrzaj;
      })
      .filter((sadrzaj): sadrzaj is Sadrzaj => {
        const isValid = !!sadrzaj;
        return isValid;
      });

    return result;
  };

  // Helper method to parse URL search params for accommodation filtering
  const parseSearchParams = () => {
    const route = useRoute();
    const params = route.query;

    const filters: SearchFilters = {
      location: (params.location as string) || "",
      type: (params.type as string) || "",
      checkin: (params.checkin as string) || "",
      checkout: (params.checkout as string) || "",
      adults: (params.adults as string) || "",
      children: (params.children as string) || "",
    };

    return filters;
  };

  return {
    smjestaji,
    availableSmjestaji,
    currentSmjestaj,
    sadrzaji,
    isLoading,
    error,
    isSmjestajAvailable,
    fetchSmjestaji,
    fetchSmjestajiByRegija,
    fetchSmjestajiByTip,
    fetchSmjestaj,
    fetchSmjestajBySlug,
    fetchSmjestajSadrzajiRelations,
    fetchSadrzaji,
    fetchAvailableSmjestaji,
    checkSmjestajAvailability,
    parseSearchParams,
    formatPrice,
    formatPriceHRK,
    getThumbnailUrl,
    getFullAddress,
    hasAmenity,
    getSadrzajIconUrl,
    getSmjestajSadrzaji,
  };
};
