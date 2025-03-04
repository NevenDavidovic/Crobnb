<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Popis smještaja i sadržaja</h1>

    <!-- Debug controls (you can remove this in production) -->
    <div class="mb-6 bg-gray-100 p-4 rounded">
      <div class="flex gap-2">
        <button
          @click="loadData"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Učitaj podatke
        </button>
        <button
          @click="loadSadrzajiRelations"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Poveži sadržaje
        </button>
      </div>
      <div class="mt-2 text-sm">
        <p>Broj smještaja: {{ smjestaji.length }}</p>
        <p v-if="smjestaji.length > 0">
          Prvi smještaj ima {{ smjestaji[0].sadrzaji?.length || 0 }} sadržaja
        </p>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex justify-center my-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Error message -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <p>{{ error }}</p>
    </div>

    <!-- No results -->
    <div v-else-if="smjestaji.length === 0" class="text-center my-12">
      <p class="text-lg text-gray-600">Nema dostupnih smještaja.</p>
    </div>

    <!-- Results -->
    <div v-else class="grid gap-8">
      <div
        v-for="smjestaj in smjestaji"
        :key="smjestaj.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <!-- Header with accommodation info -->
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
          >
            <div>
              <h2 class="text-2xl font-semibold mb-2">{{ smjestaj.naziv }}</h2>
              <p class="text-gray-600 mb-1">{{ getFullAddress(smjestaj) }}</p>
              <div class="flex items-center mb-1">
                <span class="font-medium mr-2">Cijena:</span>
                <span>{{ formatPrice(smjestaj.cijena_nocenja) }}</span>
                <span class="text-gray-500 ml-2"
                  >({{ formatPriceHRK(smjestaj.cijena_nocenja) }})</span
                >
              </div>
              <div class="flex items-center mb-1">
                <span class="font-medium mr-2">Tip:</span>
                <span>{{
                  smjestaj.tip_smjestaja?.naziv || "Nije definirano"
                }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-medium mr-2">Regija:</span>
                <span>{{ smjestaj.regija?.naziv || "Nije definirano" }}</span>
              </div>
            </div>

            <div class="mt-4 md:mt-0">
              <img
                v-if="getThumbnailUrl(smjestaj)"
                :src="getThumbnailUrl(smjestaj)"
                :alt="smjestaj.naziv"
                class="w-32 h-32 object-cover rounded"
              />
              <div
                v-else
                class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center"
              >
                <span class="text-gray-500 text-sm">Nema slike</span>
              </div>
            </div>
          </div>

          <!-- Amenities section -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Sadržaji</h3>

            <div
              v-if="!smjestaj.sadrzaji || smjestaj.sadrzaji.length === 0"
              class="text-gray-500 italic"
            >
              Nema dostupnih sadržaja za ovaj smještaj.
            </div>

            <div
              v-else
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <div
                v-for="item in smjestaj.sadrzaji"
                :key="`${smjestaj.id}_${item.sadrzaj_id}`"
                class="flex items-center p-3 bg-gray-50 rounded"
              >
                <div class="w-8 h-8 mr-3 flex-shrink-0">
                  <img
                    v-if="item.sadrzaj && getSadrzajIconUrl(item.sadrzaj)"
                    :src="getSadrzajIconUrl(item.sadrzaj)"
                    :alt="item.sadrzaj?.naziv"
                    class="w-full h-full object-contain"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gray-200 rounded flex items-center justify-center"
                  >
                    <span class="text-xs text-gray-500">Ikona</span>
                  </div>
                </div>
                <span>{{
                  item.sadrzaj?.naziv || `Sadržaj #${item.sadrzaj_id}`
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

// Import the composable
const {
  smjestaji,
  sadrzaji,
  isLoading,
  error,
  fetchSmjestaji,
  fetchSadrzaji,
  fetchSmjestajSadrzajiRelations,
  formatPrice,
  formatPriceHRK,
  getThumbnailUrl,
  getFullAddress,
  getSadrzajIconUrl,
} = useSmjestaji();

// Function to load all data
const loadData = async () => {
  await fetchSmjestaji();
  await fetchSadrzaji();
};

// Function to load smjestaj-sadrzaji relations
const loadSadrzajiRelations = async () => {
  await fetchSmjestajSadrzajiRelations();
};

// Fetch all data when the page loads
onMounted(async () => {
  await loadData();
  await loadSadrzajiRelations();
});
</script>
