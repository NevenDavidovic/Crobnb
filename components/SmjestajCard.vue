<template>
  <div
    class="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex flex-col md:flex-row">
      <!-- Left column: Image -->
      <div class="w-full md:w-1/3 relative">
        <img
          v-if="getThumbnailUrl(smjestaj) !== null"
          :src="getThumbnailUrl(smjestaj) || undefined"
          :alt="smjestaj.naziv"
          class="w-full h-64 md:h-full object-cover"
        />
        <div
          v-else
          class="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h3a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <button
          class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
          @click="toggleFavorite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            :class="
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
            "
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <!-- Right column: Details -->
      <div class="w-full md:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <!-- Header with type and stars -->
          <div class="text-sm text-gray-500 uppercase mb-1">
            {{ smjestaj.tip_smjestaja?.naziv || "SMJEŠTAJ" }}
          </div>
          <h3 class="text-xl font-bold mb-2">{{ smjestaj.naziv }}</h3>
          <div class="flex items-center mb-3">
            <div class="flex text-yellow-400">
              <span v-for="i in 5" :key="i" class="text-lg">★</span>
            </div>
          </div>

          <!-- Address -->
          <p class="text-gray-600 mb-4">
            {{ smjestaj.adresa }}, {{ smjestaj.postanski_broj }}
            {{ smjestaj.grad }}, {{ smjestaj.regija?.naziv || "Hrvatska" }}
          </p>

          <!-- Amenities -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <div
              v-if="hasSadrzaj('bazen')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4M4 4h16"
                  />
                </svg>
              </div>
              Bazen
            </div>
            <div
              v-if="hasSadrzaj('klima')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v18m0-18h7a2 2 0 012 2v14a2 2 0 01-2 2h-7m0-18H5a2 2 0 00-2 2v14a2 2 0 002 2h7"
                  />
                </svg>
              </div>
              Klima
            </div>
            <div
              v-if="hasSadrzaj('parking')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5h14v14H5V5z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5v14M15 5v14"
                  />
                </svg>
              </div>
              Parking
            </div>
            <div
              v-if="hasSadrzaj('wifi')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.07c3.904-3.905 10.246-3.905 14.15 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
              </div>
              WiFi
            </div>
            <div
              v-if="hasSadrzaj('sauna')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              Sauna
            </div>
            <div
              v-if="hasSadrzaj('tenis')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                  />
                </svg>
              </div>
              Tenis igralište
            </div>
            <div
              v-if="hasSadrzaj('caffe')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
              </div>
              Caffe bar
            </div>
            <div
              v-if="hasSadrzaj('wellness')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 0L9.121 9.121"
                  />
                </svg>
              </div>
              Wellness&Spa
            </div>
            <div
              v-if="hasSadrzaj('restoran')"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              Restoran
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="mb-3 md:mb-0">
            <div class="text-2xl font-bold text-right">
              {{ formatPrice(smjestaj.cijena_nocenja) }}
            </div>
            <div class="text-sm text-gray-500 text-right">
              {{ formatPriceHRK(smjestaj.cijena_nocenja) }}
            </div>
          </div>
          <NuxtLink
            :to="`/smjestaj/${smjestaj.slug || smjestaj.id}`"
            class="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition"
          >
            Pogledaj detalje
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Smjestaj } from "~/types/directus/index";

interface SmjestajCardProps {
  smjestaj: Smjestaj;
  getThumbnailUrl: (smjestaj: Smjestaj) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
}

export default defineComponent({
  props: {
    smjestaj: {
      type: Object as PropType<Smjestaj>,
      required: true,
    },
    getThumbnailUrl: {
      type: Function as PropType<(smjestaj: Smjestaj) => string | null>,
      required: true,
    },
    formatPrice: {
      type: Function as PropType<(price: number) => string>,
      required: true,
    },
    formatPriceHRK: {
      type: Function as PropType<(price: number) => string>,
      required: true,
    },
  },

  setup({ smjestaj }: SmjestajCardProps) {
    const isFavorite = ref(false);

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
    };

    // Helper to check if the accommodation has a specific amenity by name
    const hasSadrzaj = (name: string): boolean => {
      if (!smjestaj.sadrzaji) return false;

      return smjestaj.sadrzaji.some((item) => {
        if (item.sadrzaj) {
          // Check if the sadrzaj object has a name that matches
          return item.sadrzaj.naziv.toLowerCase().includes(name.toLowerCase());
        }
        return false;
      });
    };

    return {
      isFavorite,
      toggleFavorite,
      hasSadrzaj,
    };
  },
});
</script>
