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
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useRegije } from "~/composables/useRegije";
import { useSmjestaji } from "~/composables/useSmjestaji";
import type { Smjestaj } from "~/types/directus/index";

export default defineComponent({
  setup() {
    // Fetch composables
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
      isLoading,
      error,
      fetchSmjestaji,
      fetchSmjestajiByRegija,
      fetchSmjestajiByTip,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
    } = useSmjestaji();

    // Filter states
    const selectedRegion = ref<number | null>(null);
    const selectedType = ref<number | null>(null);
    const selectedPriceRange = ref<string | null>(null);

    // Local copy of smjestaji for filtering
    const allSmjestaji = ref<Smjestaj[]>([]);
    const filteredSmjestaji = ref<Smjestaj[]>([]);

    // Load initial data
    onMounted(async () => {
      try {
        // Fetch all required data in parallel
        await Promise.all([fetchTipovi(), fetchRegije(), fetchSmjestaji()]);

        // Initialize filter data
        allSmjestaji.value = [...smjestaji.value];
        filteredSmjestaji.value = [...smjestaji.value];
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    });

    // Watch for changes in the smjestaji data
    // Watch for changes in the smjestaji data
    watch(smjestaji, (newSmjestaji: Smjestaj[]) => {
      allSmjestaji.value = [...newSmjestaji];
      applyFilters();
    });

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
              (item: Smjestaj) => item.smjestaj_id === selectedType.value
            );
          } else {
            allSmjestaji.value = [...smjestaji.value];
          }
        }
      } catch (err) {
        console.error("Error applying region filter:", err);
      }

      applyFilters();
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
      } catch (err) {
        console.error("Error applying type filter:", err);
      }

      applyFilters();
    };

    const applyFilters = () => {
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
      smjestaji: allSmjestaji,
      filteredSmjestaji,
      isLoading,
      error,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,

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
