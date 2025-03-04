<template>
  <div class="">
    <SearchFilterComponent
      :tipovi="tipovi"
      :tipovi-loading="tipoviLoading"
      :tipovi-error="tipoviError || undefined"
      :regije="regije"
      :regije-loading="regijeLoading"
      :regije-error="regijeError || undefined"
    />
    <div class="flex max-w-1200 px-4 mx-auto">
      <div class="bg-white rounded-lg shadow p-4 w-full max-w-xs">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 class="font-medium text-gray-800">Filtriroj po:</h3>
          <button class="text-blue-500 text-sm">Resetiraj</button>
        </div>

        <!-- Price Range -->
        <div class="mb-6 pb-4 border-b">
          <p class="text-gray-700 mb-2">Raspon cijena (EUR)</p>
          <div class="flex justify-between text-gray-500 text-sm mb-1">
            <span>0</span>
            <span>240</span>
          </div>
          <div class="relative h-2 mb-4">
            <!-- Track -->
            <div class="absolute w-full h-2 bg-gray-200 rounded"></div>

            <!-- Selected range -->
            <div
              class="absolute h-2 bg-blue-500 rounded"
              style="width: 25%; left: 0"
            ></div>

            <!-- Min handle -->
            <div
              class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 -ml-1"
              style="left: 0%"
            ></div>

            <!-- Max handle -->
            <div
              class="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full -mt-1.5 -ml-1"
              style="left: 25%"
            ></div>
          </div>
        </div>

        <!-- Star Rating -->
        <div class="mb-6 pb-4 border-b">
          <p class="text-gray-700 mb-2">Broj zvjezdica</p>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
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

        <!-- Popular Filters -->
        <div class="mb-6">
          <p class="text-gray-700 mb-2">Popularni filteri</p>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
              />
              <span class="text-gray-700">Bazen</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
              />
              <span class="text-gray-700">WiFi</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
              />
              <span class="text-gray-700">Klima</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
              />
              <span class="text-gray-700">Parking</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
              />
              <span class="text-gray-700">Apartman</span>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 text-blue-500 rounded border-gray-300 mr-2"
              />
              <span class="text-gray-700">TV</span>
            </div>
          </div>
        </div>

        <!-- Apply Button -->
        <button
          class="w-full py-2 bg-white border border-blue-500 text-blue-500 rounded font-medium hover:bg-blue-50 transition-colors"
        >
          Primijeni filter
        </button>
      </div>

      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold mb-8">Accommodation Listings</h1>

        <!-- Filters section (can be expanded later) -->
        <div class="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Filters</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Region filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Region</label
              >
              <select
                v-model="selectedRegion"
                class="w-full p-2 border border-gray-300 rounded-md"
                @change="handleRegionChange"
              >
                <option :value="null">All regions</option>
                <option
                  v-for="regija in regije"
                  :key="regija.id"
                  :value="regija.id"
                >
                  {{ regija.naziv }}
                </option>
              </select>
            </div>

            <!-- Accommodation type filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Type</label
              >
              <select
                v-model="selectedType"
                class="w-full p-2 border border-gray-300 rounded-md"
                @change="handleTypeChange"
              >
                <option :value="null">All types</option>
                <option v-for="tip in tipovi" :key="tip.id" :value="tip.id">
                  {{ tip.naziv }}
                </option>
              </select>
            </div>

            <!-- Price range filter (could be expanded) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Price range</label
              >
              <select
                v-model="selectedPriceRange"
                class="w-full p-2 border border-gray-300 rounded-md"
                @change="applyFilters"
              >
                <option :value="null">Any price</option>
                <option value="0-50">Up to 50 EUR</option>
                <option value="50-100">50 - 100 EUR</option>
                <option value="100-200">100 - 200 EUR</option>
                <option value="200+">200+ EUR</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results section -->
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
import type { TipSmjestaja, Smjestaj } from "~/types/directus/index";

export default defineComponent({
  setup() {
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
    } = useSmjestaji();

    // Filter states
    const selectedRegion = ref<number | null>(null);
    const selectedType = ref<number | null>(null);
    const selectedPriceRange = ref<string | null>(null);

    // Local copy of smjestaji for filtering
    const allSmjestaji = ref<Smjestaj[]>([]);
    const filteredSmjestaji = ref<Smjestaj[]>([]);

    // Connect accommodation types to their objects
    const linkTipoviSmjestaja = () => {
      // Check if tipovi and smjestaji are both loaded
      if (tipovi.value.length === 0 || allSmjestaji.value.length === 0) {
        console.log("Cannot link types: missing data");
        return;
      }

      console.log("Linking accommodation types to accommodations");

      // Create a new array with updated objects to ensure reactivity
      const linkedSmjestaji = [...allSmjestaji.value].map(
        (smjestaj: Smjestaj) => {
          // Skip if already linked
          if (smjestaj.tip_smjestaja) {
            return smjestaj;
          }

          // Find the matching tip_smjestaja by ID
          const matchingTip = tipovi.value.find(
            (tip: TipSmjestaja) => tip.id === smjestaj.tipovi_smjestaja_id
          );

          if (matchingTip) {
            console.log(
              `Linked type ${matchingTip.naziv} to smjestaj ${smjestaj.naziv}`
            );

            // Important: create a new object to ensure Vue's reactivity
            return {
              ...smjestaj,
              tip_smjestaja: { ...matchingTip },
            };
          }

          return { ...smjestaj };
        }
      );

      // Update both refs with new arrays
      allSmjestaji.value = linkedSmjestaji;
      filteredSmjestaji.value = [...linkedSmjestaji];

      // Log to verify linkage
      console.log(
        "After linking - First accommodation type:",
        allSmjestaji.value[0]?.tip_smjestaja
      );
    };

    // Update filtered results based on price range
    const applyFilters = () => {
      // Make sure types are linked before filtering
      linkTipoviSmjestaja();

      if (selectedPriceRange.value === null) {
        filteredSmjestaji.value = [...allSmjestaji.value];
        return;
      }

      let minPrice = 0;
      let maxPrice = Infinity;

      switch (selectedPriceRange.value) {
        case "0-50":
          maxPrice = 50;
          break;
        case "50-100":
          minPrice = 50;
          maxPrice = 100;
          break;
        case "100-200":
          minPrice = 100;
          maxPrice = 200;
          break;
        case "200+":
          minPrice = 200;
          break;
      }

      filteredSmjestaji.value = allSmjestaji.value.filter((item: Smjestaj) => {
        const price = item.cijena_nocenja;
        return price >= minPrice && price <= maxPrice;
      });
    };

    // Apply region filter
    const handleRegionChange = async () => {
      try {
        if (selectedRegion.value === null) {
          // Reset to all if no region is selected
          if (selectedType.value === null) {
            await fetchSmjestaji();
          } else {
            await fetchSmjestajiByTip(selectedType.value);
          }
        } else {
          await fetchSmjestajiByRegija(selectedRegion.value);

          // If type is also selected, we need to filter the results client-side
          if (selectedType.value !== null) {
            allSmjestaji.value = smjestaji.value.filter(
              (item: Smjestaj) =>
                item.tipovi_smjestaja_id === selectedType.value
            );
          } else {
            allSmjestaji.value = [...smjestaji.value];
          }
        }

        // Link types and apply filters
        linkTipoviSmjestaja();
        applyFilters();
      } catch (err) {
        console.error("Error applying region filter:", err);
      }
    };

    // Apply type filter
    const handleTypeChange = async () => {
      try {
        if (selectedType.value === null) {
          // Reset to all if no type is selected
          if (selectedRegion.value === null) {
            await fetchSmjestaji();
          } else {
            await fetchSmjestajiByRegija(selectedRegion.value);
          }
        } else {
          await fetchSmjestajiByTip(selectedType.value);

          if (selectedRegion.value !== null) {
            allSmjestaji.value = smjestaji.value.filter(
              (item: Smjestaj) => item.regija_id === selectedRegion.value
            );
          } else {
            allSmjestaji.value = [...smjestaji.value];
          }
        }

        // Link types and apply filters
        linkTipoviSmjestaja();
        applyFilters();
      } catch (err) {
        console.error("Error applying type filter:", err);
      }
    };

    // Load initial data
    onMounted(async () => {
      try {
        // Fetch all required data
        await fetchTipovi();
        await fetchRegije();
        await fetchSadrzaji();
        await fetchSmjestaji();

        // Process relationships
        await fetchSmjestajSadrzajiRelations();

        // Set initial data
        allSmjestaji.value = [...smjestaji.value];

        // Link accommodation types and apply initial filters
        linkTipoviSmjestaja();
        applyFilters();

        // Debug information
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

    // Watch for changes in source data
    watch(smjestaji, (newSmjestaji: Smjestaj[]) => {
      allSmjestaji.value = [...newSmjestaji];
      linkTipoviSmjestaja();
      applyFilters();
    });

    // Watch for changes in types data
    watch(
      tipovi,
      () => {
        if (allSmjestaji.value.length > 0) {
          linkTipoviSmjestaja();
        }
      },
      { deep: true }
    );

    // Watch for price range changes
    watch(selectedPriceRange, () => {
      applyFilters();
    });

    return {
      // From tipovi composable
      tipovi,
      tipoviLoading,
      tipoviError,

      // From regije composable
      regije,
      regijeLoading,
      regijeError,

      // From smjestaji composable
      smjestaji: allSmjestaji, // Important: passing linked data
      filteredSmjestaji,
      isLoading,
      error,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,

      // Filter state and handlers
      selectedRegion,
      selectedType,
      selectedPriceRange,
      handleRegionChange,
      handleTypeChange,
      applyFilters,
    };
  },
});
</script>
