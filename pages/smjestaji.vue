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
      <div class="bg-white rounded-lg shadow p-4 w-full max-w-xs">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="font-medium text-gray-800">Filtriroj po:</h3>
          <button @click="resetFilters" class="text-blue-500 text-sm">
            Resetiraj
          </button>
        </div>

        <div class="mb-6 pb-4 border-b">
          <p class="text-gray-700 mb-2">Raspon cijena (EUR)</p>
          <div class="flex justify-between text-gray-500 text-sm mb-1">
            <span>{{ currentPriceMin }}</span>
            <span>{{ currentPriceMax }}</span>
          </div>
          <div class="relative h-2 mb-4">
            <div class="absolute w-full h-2 bg-gray-200 rounded"></div>

            <div
              class="absolute h-2 bg-blue-500 rounded"
              :style="`width: ${sliderWidth}%; left: ${sliderMinPercent}%`"
            ></div>

            <div
              class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 -ml-1 cursor-pointer"
              :style="`left: ${sliderMinPercent}%`"
              @mousedown="startDrag('min', $event)"
            ></div>

            <div
              class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 -ml-1 cursor-pointer"
              :style="`left: ${sliderMaxPercent}%`"
              @mousedown="startDrag('max', $event)"
            ></div>
          </div>
        </div>

        <div class="mb-6 pb-4 border-b">
          <p class="text-gray-700 mb-2">Broj zvjezdica</p>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="selectedStars.includes(5)"
                @change="toggleStarRating(5)"
              />
              <div class="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span
                ><span>★</span>
              </div>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="selectedStars.includes(4)"
                @change="toggleStarRating(4)"
              />
              <div class="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span
                ><span class="text-gray-200">★</span>
              </div>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="selectedStars.includes(3)"
                @change="toggleStarRating(3)"
              />
              <div class="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span
                ><span class="text-gray-200">★</span
                ><span class="text-gray-200">★</span>
              </div>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="selectedStars.includes(2)"
                @change="toggleStarRating(2)"
              />
              <div class="flex text-yellow-400">
                <span>★</span><span>★</span><span class="text-gray-200">★</span
                ><span class="text-gray-200">★</span
                ><span class="text-gray-200">★</span>
              </div>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="selectedStars.includes(1)"
                @change="toggleStarRating(1)"
              />
              <div class="flex text-yellow-400">
                <span>★</span><span class="text-gray-200">★</span
                ><span class="text-gray-200">★</span
                ><span class="text-gray-200">★</span
                ><span class="text-gray-200">★</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <p class="text-gray-700 mb-2">Popularni filteri</p>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="
                  selectedAmenities.includes(getAmenityIdByName('Bazen'))
                "
                @change="toggleAmenity('Bazen')"
              />
              <span class="text-gray-700">Bazen</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="
                  selectedAmenities.includes(getAmenityIdByName('WiFi'))
                "
                @change="toggleAmenity('WiFi')"
              />
              <span class="text-gray-700">WiFi</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="
                  selectedAmenities.includes(getAmenityIdByName('Klima'))
                "
                @change="toggleAmenity('Klima')"
              />
              <span class="text-gray-700">Klima</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="
                  selectedAmenities.includes(getAmenityIdByName('Parking'))
                "
                @change="toggleAmenity('Parking')"
              />
              <span class="text-gray-700">Parking</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="isApartmanTypeSelected"
                @change="toggleApartmanType"
              />
              <span class="text-gray-700">Apartman</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
                :checked="selectedAmenities.includes(getAmenityIdByName('TV'))"
                @change="toggleAmenity('TV')"
              />
              <span class="text-gray-700">TV</span>
            </div>
          </div>
        </div>

        <button
          @click="applyFilters"
          class="w-full py-2 bg-white border border-blue-500 text-blue-500 rounded font-medium hover:bg-blue-50 transition-colors"
        >
          Primijeni filter
        </button>
      </div>

      <div class="flex-1 py-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-[25px] font-bold text-gray-100">
            {{ filteredSmjestaji.length }} smještaja pronađeno
          </h1>

          <div class="relative">
            <button
              @click="toggleSortDropdown"
              class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span class="text-gray-80 text-base">Sortiraj po:</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                :class="{ 'transform rotate-180': showSortDropdown }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#BEC0C5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              v-if="showSortDropdown"
              class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            >
              <div class="py-1">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="setSortOption(option.value)"
                  class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  :class="{
                    'font-medium text-blue-600': sortBy === option.value,
                  }"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

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
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useRegije } from "~/composables/useRegije";
import { useSmjestaji } from "~/composables/useSmjestaji";
import type { TipSmjestaja, Smjestaj, Sadrzaj } from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";

export default defineComponent({
  setup() {
    const route = useRoute();

    const showSortDropdown = ref(false);
    const sortBy = ref<string>("default");

    const sortOptions = [
      { label: "Cijena: niža prema višoj", value: "price-asc" },
      { label: "Cijena: viša prema nižoj", value: "price-desc" },
      { label: "Zvijezdice: niže prema višem", value: "stars-asc" },
      { label: "Zvijezdice: više prema nižem", value: "stars-desc" },
    ];

    const toggleSortDropdown = () => {
      showSortDropdown.value = !showSortDropdown.value;
    };

    const setSortOption = (option: string) => {
      sortBy.value = option;
      showSortDropdown.value = false;
      applySort();
    };

    const applySort = () => {
      const sortedResults = [...filteredSmjestaji.value];

      switch (sortBy.value) {
        case "price-asc":
          sortedResults.sort(
            (a, b) => (a.cijena_nocenja || 0) - (b.cijena_nocenja || 0)
          );
          break;
        case "price-desc":
          sortedResults.sort(
            (a, b) => (b.cijena_nocenja || 0) - (a.cijena_nocenja || 0)
          );
          break;
        case "stars-asc":
          sortedResults.sort(
            (a, b) => (a.broj_zvjezdica || 0) - (b.broj_zvjezdica || 0)
          );
          break;
        case "stars-desc":
          sortedResults.sort(
            (a, b) => (b.broj_zvjezdica || 0) - (a.broj_zvjezdica || 0)
          );
          break;
        default:
          // No sorting applied
          break;
      }

      // Update filtered results with the sorted array
      filteredSmjestaji.value = sortedResults;
    };

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
      smjestaji,
      sadrzaji,
      isLoading,
      error,
      fetchSmjestaji,
      fetchSmjestajiByRegija,
      fetchSmjestajiByTip,
      fetchSadrzaji,
      fetchSmjestajSadrzajiRelations,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,
      hasAmenity,
    } = useSmjestaji();

    // Filter states
    const selectedRegion = ref<number | null>(null);
    const selectedType = ref<number | null>(null);
    const selectedPriceRange = ref<string | null>(null);
    const checkinDate = ref<string | null>(null);
    const checkoutDate = ref<string | null>(null);
    const adults = ref<number>(2);
    const children = ref<number>(0);

    // Advanced filter states
    const priceMin = ref(0);
    const priceMax = computed(() => {
      if (allSmjestaji.value.length === 0) return 240; // Default fallback

      // Find the maximum price from all accommodations
      return Math.ceil(
        Math.max(
          ...allSmjestaji.value.map(
            (item: { cijena_nocenja: number }) => item.cijena_nocenja || 0
          )
        )
      );
    });
    const currentPriceMin = ref(0);
    const currentPriceMax = ref(0);

    const updatePriceRange = () => {
      currentPriceMax.value = priceMax.value;
    };

    const selectedStars = ref<number[]>([]);
    const selectedAmenities = ref<number[]>([]);

    // Slider drag state
    const dragType = ref<"min" | "max" | null>(null);

    const sliderMinPercent = computed(
      () => (currentPriceMin.value / priceMax.value) * 100
    );
    const sliderMaxPercent = computed(
      () => (currentPriceMax.value / priceMax.value) * 100
    );
    const sliderWidth = computed(
      () => sliderMaxPercent.value - sliderMinPercent.value
    );

    // Computed check for Apartman type
    const isApartmanTypeSelected = computed(() => {
      const apartmanType = tipovi.value.find(
        (t: { naziv: string }) => t.naziv === "Apartman"
      );
      return apartmanType && selectedType.value === apartmanType.id;
    });

    // Main data arrays
    const allSmjestaji = ref<Smjestaj[]>([]);
    const filteredSmjestaji = ref<Smjestaj[]>([]);

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

    // Connect accommodation types to their objects
    const linkTipoviSmjestaja = () => {
      if (tipovi.value.length === 0 || allSmjestaji.value.length === 0) {
        console.log("Cannot link types: missing data");
        return;
      }

      console.log("Linking accommodation types to accommodations");

      const linkedSmjestaji = [...allSmjestaji.value].map(
        (smjestaj: Smjestaj) => {
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

            return {
              ...smjestaj,
              tip_smjestaja: { ...matchingTip },
            };
          }

          return { ...smjestaj };
        }
      );

      allSmjestaji.value = linkedSmjestaji;
      filteredSmjestaji.value = [...linkedSmjestaji];

      console.log(
        "After linking - First accommodation type:",
        allSmjestaji.value[0]?.tip_smjestaja
      );
    };

    // Reset all filters
    const resetFilters = () => {
      selectedRegion.value = null;
      selectedType.value = null;
      currentPriceMin.value = 0;
      currentPriceMax.value = 60; // 25% of max
      selectedStars.value = [];
      selectedAmenities.value = [];
      checkinDate.value = null;
      checkoutDate.value = null;
      adults.value = 2;
      children.value = 0;

      // Reset URL params
      navigateTo({
        path: "/smjestaji",
        query: {},
      });

      // Reset filteredSmjestaji to show all
      filteredSmjestaji.value = [...allSmjestaji.value];
    };

    // Toggle star rating filter
    const toggleStarRating = (stars: number) => {
      const index = selectedStars.value.indexOf(stars);
      if (index === -1) {
        selectedStars.value.push(stars);
      } else {
        selectedStars.value.splice(index, 1);
      }
      applyFilters();
    };

    // Get amenity ID by name
    const getAmenityIdByName = (name: string): number => {
      const amenity = sadrzaji.value.find(
        (s: { naziv: string }) => s.naziv.toLowerCase() === name.toLowerCase()
      );
      return amenity ? amenity.id : -1;
    };

    // Toggle amenity filter
    const toggleAmenity = (name: string) => {
      const amenityId = getAmenityIdByName(name);
      if (amenityId === -1) return;

      const index = selectedAmenities.value.indexOf(amenityId);
      if (index === -1) {
        selectedAmenities.value.push(amenityId);
      } else {
        selectedAmenities.value.splice(index, 1);
      }
    };

    // Toggle Apartman type
    const toggleApartmanType = () => {
      const apartmanType = tipovi.value.find(
        (t: { naziv: string }) => t.naziv === "Apartman"
      );
      if (!apartmanType) return;

      if (selectedType.value === apartmanType.id) {
        selectedType.value = null;
      } else {
        selectedType.value = apartmanType.id;
      }
    };

    const startDrag = (type: "min" | "max", event: MouseEvent) => {
      dragType.value = type;

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);

      event.preventDefault();
    };

    const handleDrag = (event: MouseEvent) => {
      if (!dragType.value) return;

      const slider = event.target as HTMLElement;
      const sliderRect = slider.parentElement?.getBoundingClientRect();
      if (!sliderRect) return;

      const offsetX = event.clientX - sliderRect.left;
      const percent = Math.min(Math.max(0, offsetX / sliderRect.width), 1);
      const newValue = Math.round(percent * priceMax.value);

      if (dragType.value === "min") {
        currentPriceMin.value = Math.min(newValue, currentPriceMax.value - 10);
      } else {
        currentPriceMax.value = Math.max(newValue, currentPriceMin.value + 10);
      }
    };

    const stopDrag = () => {
      dragType.value = null;
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    const applyFilters = () => {
      let results = [...allSmjestaji.value];

      if (selectedRegion.value !== null) {
        results = results.filter(
          (item) => item.regija_id === selectedRegion.value
        );
      }

      if (selectedType.value !== null) {
        results = results.filter(
          (item) => item.tipovi_smjestaja_id === selectedType.value
        );
      }

      results = results.filter((item) => {
        const price = item.cijena_nocenja;
        return price >= currentPriceMin.value && price <= currentPriceMax.value;
      });

      if (selectedStars.value.length > 0) {
        results = results.filter((item) =>
          selectedStars.value.includes(item.broj_zvjezdica || 0)
        );
      }

      if (selectedAmenities.value.length > 0) {
        results = results.filter((item) =>
          selectedAmenities.value.every((amenityId: number) =>
            hasAmenity(item, amenityId)
          )
        );
      }

      const totalPersons = adults.value + children.value;
      results = results.filter((item) => {
        if (
          item.max_broj_gostiju === undefined ||
          item.max_broj_gostiju === null
        ) {
          return true;
        }

        return totalPersons <= item.max_broj_gostiju;
      });

      filteredSmjestaji.value = results;

      if (sortBy.value !== "default") {
        applySort();
      }
    };

    onMounted(async () => {
      try {
        document.addEventListener("click", (event) => {
          const target = event.target as HTMLElement;
          if (showSortDropdown.value && !target.closest(".relative")) {
            showSortDropdown.value = false;
          }
        });
        await fetchTipovi();
        await fetchRegije();
        await fetchSadrzaji();

        if (!route.query.location && !route.query.type) {
          await fetchSmjestaji();
          allSmjestaji.value = [...smjestaji.value];
        } else {
        }

        await fetchSmjestajSadrzajiRelations();

        linkTipoviSmjestaja();

        updatePriceRange();

        if (Object.keys(route.query).length === 0) {
          filteredSmjestaji.value = [...allSmjestaji.value];
        } else {
          applyFilters();
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

    // Watch for URL changes
    watch(
      () => route.query,
      async () => {
        if (Object.keys(route.query).length > 0) {
        } else {
          // Reset to all if URL is cleared
          await fetchSmjestaji();
          allSmjestaji.value = [...smjestaji.value];
          linkTipoviSmjestaja();
          filteredSmjestaji.value = [...allSmjestaji.value];
        }
      },
      { deep: true }
    );

    // Watch for smjestaji changes
    watch(smjestaji, (newSmjestaji: Smjestaj[]) => {
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
      smjestaji: allSmjestaji,
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
      priceMin,
      priceMax,
      currentPriceMin,
      currentPriceMax,
      sliderMinPercent,
      sliderMaxPercent,
      sliderWidth,
      selectedStars,
      selectedAmenities,
      isApartmanTypeSelected,
      showSortDropdown,
      sortBy,
      sortOptions,
      toggleSortDropdown,
      setSortOption,
      applySort,

      // Methods
      onSearch,
      resetFilters,
      toggleStarRating,
      toggleAmenity,
      toggleApartmanType,
      getAmenityIdByName,
      applyFilters,
      startDrag,
      handleDrag,
      stopDrag,
      updatePriceRange,
    };
  },
});
</script>
