<template>
  <div class="mb-[52px]">
    <SearchFilterComponent
      :tipovi="tipovi"
      :tipovi-loading="tipoviLoading"
      :tipovi-error="tipoviError || undefined"
      :regije="regije"
      :regije-loading="regijeLoading"
      :regije-error="regijeError || undefined"
      @search="onSearch"
    />
    <div class="flex max-w-1200 px-4 mx-auto gap-6">
      <SmjestajGrid
        :smjestaji="filteredSmjestaji"
        :is-loading="isLoading"
        :error="error"
        :get-thumbnail-url="getThumbnailUrl"
        :format-price="formatPrice"
        :format-price-h-r-k="formatPriceHRK"
        :get-sadrzaj-icon-url="getSadrzajIconUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useRegije } from "~/composables/useRegije";
import { useSmjestaji } from "~/composables/useSmjestaji";
import type {
  TipSmjestaja,
  Smjestaj,
  Regija,
  SmjestajWithRelations,
  DirectusFile,
} from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";

export default defineComponent({
  setup() {
    const route = useRoute();

    const {
      tipovi,
      isLoading: tipoviLoading,
      error: tipoviError,
      fetchTipovi,
    } = useTipoviSmjestaja();

    const {
      regije,
      isLoading: regijeLoading,
      error: regijeError,
      fetchRegije,
    } = useRegije();

    const {
      completeSmjestaji, // Use this instead of smjestaji
      fetchCompleteSmjestaji, // Use this instead of fetchSmjestaji
      sadrzaji,
      isLoading,
      error,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,
      hasAmenity,
      fetchSadrzaji,
    } = useSmjestaji();

    // Filter states
    const selectedRegion = ref<number | null>(null);
    const selectedType = ref<number | null>(null);
    const selectedPriceRange = ref<string | null>(null);
    const checkinDate = ref<Date | null>(null);
    const checkoutDate = ref<Date | null>(null);
    const adults = ref<number>(2);
    const children = ref<number>(0);

    const selectedStars = ref<number[]>([]);
    const selectedAmenities = ref<number[]>([]);

    // Computed check for Apartman type
    const isApartmanTypeSelected = computed(() => {
      const apartmanType = tipovi.value.find(
        (t: { naziv: string }) => t.naziv === "Apartman"
      );
      return apartmanType && selectedType.value === apartmanType.id;
    });

    // Main data arrays
    const allSmjestaji = ref<SmjestajWithRelations[]>([]);
    const filteredSmjestaji = ref<SmjestajWithRelations[]>([]);

    const onSearch = (filters: SearchFilters): void => {
      console.log("Search filters received:", filters);

      // Update the URL
      const queryParams: Record<string, string> = {
        location: filters.location,
        type: filters.type,
        checkin: filters.checkin,
        checkout: filters.checkout,
        adults: filters.adults.toString(),
        children: filters.children.toString(),
      };

      navigateTo({
        path: "/smjestaji",
        query: queryParams,
      });
    };

    const linkTipoviSmjestaja = () => {
      if (tipovi.value.length === 0 || allSmjestaji.value.length === 0) {
        console.log("Cannot link types: missing data");
        return;
      }

      console.log("Linking accommodation types to accommodations");

      // Use type assertion here to help TypeScript understand the structure
      const linkedSmjestaji = [...allSmjestaji.value].map(
        (smjestaj: SmjestajWithRelations) => {
          if (smjestaj.tip_smjestaja) {
            return smjestaj;
          }

          const matchingTip = tipovi.value.find(
            (tip: TipSmjestaja) => tip.id === smjestaj.tipovi_smjestaja_id
          );

          if (matchingTip) {
            console.log(
              `Linked type ${matchingTip.naziv} to smjestaj ${smjestaj.naziv}`
            );

            // Create a properly typed object
            return {
              ...smjestaj,
              tip_smjestaja: {
                ...matchingTip,
                // Make sure ikona is properly handled to match DirectusFile or null
                ikona: matchingTip.ikona as DirectusFile,
              },
            } as SmjestajWithRelations; // Type assertion here
          }

          return smjestaj as SmjestajWithRelations; // Type assertion here
        }
      );

      // Use type assertion to help TypeScript understand the structure
      allSmjestaji.value = linkedSmjestaji as SmjestajWithRelations[];
      filteredSmjestaji.value = [...linkedSmjestaji] as SmjestajWithRelations[];

      console.log(
        "After linking - First accommodation type:",
        allSmjestaji.value[0]?.tip_smjestaja
      );
    };

    // Get amenity ID by name
    const getAmenityIdByName = (name: string): number => {
      const amenity = sadrzaji.value.find(
        (s: { naziv: string }) => s.naziv.toLowerCase() === name.toLowerCase()
      );
      return amenity ? amenity.id : -1;
    };

    const applyFilters = () => {
      let results = [...allSmjestaji.value];

      // Apply region filter
      if (selectedRegion.value !== null) {
        results = results.filter(
          (item) => item.regija_id === selectedRegion.value
        );
      }

      // Apply type filter
      if (selectedType.value !== null) {
        results = results.filter(
          (item) => item.tipovi_smjestaja_id === selectedType.value
        );
      }

      if (selectedStars.value.length > 0) {
        results = results.filter((item) => {
          // Convert to number to ensure consistent comparison
          const stars = Number(item.broj_zvjezdica || 0);
          return selectedStars.value.includes(stars);
        });
      }

      // Apply amenities filter
      if (selectedAmenities.value.length > 0) {
        results = results.filter((item) =>
          selectedAmenities.value.every((amenityId: number) =>
            hasAmenity(item, amenityId)
          )
        );
      }

      filteredSmjestaji.value = results;
    };

    // Initial load
    onMounted(async () => {
      try {
        // Fetch all required data
        await fetchTipovi();
        await fetchRegije();
        await fetchSadrzaji();

        // Fetch complete accommodation data with all relations
        await fetchCompleteSmjestaji();
        console.log(
          "Complete data from fetchCompleteSmjestaji:",
          completeSmjestaji.value
        );
        // Update allSmjestaji with complete data
        allSmjestaji.value = [...completeSmjestaji.value];

        // Link types and update price range
        linkTipoviSmjestaja();

        // Process URL parameters if they exist
        if (Object.keys(route.query).length > 0) {
          // Handle location parameter
          if (route.query.location) {
            const locationSlug = route.query.location as string;
            const region = regije.value.find(
              (r: Regija) => r.slug === locationSlug
            );
            if (region) {
              selectedRegion.value = region.id;
            }
          }

          // Handle accommodation type parameter
          if (route.query.type) {
            const typeSlug = route.query.type as string;
            const type = tipovi.value.find(
              (t: TipSmjestaja) => t.slug === typeSlug
            );
            if (type) {
              selectedType.value = type.id;
            }
          }

          // Handle dates
          if (route.query.checkin) {
            const checkinStr = route.query.checkin as string;
            try {
              // Adjust the parsing based on your date format (dd.MM.yyyy.)
              const [day, month, year] = checkinStr.split(".");
              checkinDate.value = new Date(
                `${year.slice(0, 4)}-${month}-${day}`
              );
            } catch (error) {
              console.error("Error parsing checkin date:", error);
            }
          }

          if (route.query.checkout) {
            const checkoutStr = route.query.checkout as string;
            try {
              // Adjust the parsing based on your date format
              const [day, month, year] = checkoutStr.split(".");
              checkoutDate.value = new Date(
                `${year.slice(0, 4)}-${month}-${day}`
              );
            } catch (error) {
              console.error("Error parsing checkout date:", error);
            }
          }

          // Handle guest counts
          if (route.query.adults) {
            adults.value = Number(route.query.adults);
          } else {
            adults.value = 0;
          }

          if (route.query.children) {
            children.value = Number(route.query.children);
          } else {
            children.value = 0;
          }

          applyFilters();
        } else {
          filteredSmjestaji.value = [...allSmjestaji.value];
        }

        console.log(
          "First accommodation type:",
          allSmjestaji.value[0]?.tip_smjestaja
        );
        console.log(
          "First filtered accommodation type:",
          filteredSmjestaji.value[0]?.tip_smjestaja
        );
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    });

    watch(completeSmjestaji, (newSmjestaji: SmjestajWithRelations[]) => {
      allSmjestaji.value = [...newSmjestaji];
      linkTipoviSmjestaja();
      applyFilters();
    });

    // Watch for types data changes
    watch(
      tipovi,
      () => {
        if (allSmjestaji.value.length > 0) {
          linkTipoviSmjestaja();
          applyFilters();
        }
      },
      { deep: true }
    );

    return {
      // Basic data
      tipovi,
      tipoviLoading,
      tipoviError,
      regije,
      regijeLoading,
      regijeError,
      filteredSmjestaji,
      isLoading,
      error,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,

      // Basic filters
      selectedRegion,
      selectedType,
      selectedPriceRange,
      checkinDate,
      checkoutDate,
      adults,
      children,
      // Advanced filters
      selectedStars,
      selectedAmenities,
      isApartmanTypeSelected,
      // Methods
      onSearch,
      getAmenityIdByName,
      applyFilters,
    };
  },
});
</script>
