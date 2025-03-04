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
            <div class="flex">
              <span
                v-for="i in smjestaj.broj_zvjezdica || 5"
                :key="i"
                class="text-lg text-yellow-400"
                >★</span
              >
              <span
                v-for="i in 5 - (smjestaj.broj_zvjezdica || 5)"
                :key="`empty-${i}`"
                class="text-lg text-gray-300"
                >★</span
              >
            </div>
          </div>

          <!-- Address -->
          <p class="text-gray-600 mb-4">
            {{ smjestaj.adresa }}, {{ smjestaj.postanski_broj }}
            {{ smjestaj.grad }}, {{ smjestaj.regija?.naziv || "Hrvatska" }}
          </p>

          <!-- Capacity information -->
          <div class="flex flex-wrap gap-4 mb-4 text-gray-600">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{{ smjestaj.max_broj_gostiju }} gostiju</span>
            </div>
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 11h18M9 21V18m6 3V18"
                />
              </svg>
              <span>{{ smjestaj.broj_kreveta }} kreveta</span>
            </div>
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 5v2m0 4v10M5 5a2 2 0 012-2h10a2 2 0 012 2v5.5a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"
                />
              </svg>
              <span>{{ smjestaj.broj_kupaonica }} kupaonica</span>
            </div>
          </div>

          <!-- Amenities Section -->
          <h4 class="font-medium text-gray-700 mb-2">Sadržaji:</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <!-- Map through all amenities using amenitiesWithIcons -->
            <div
              v-for="amenity in amenitiesWithIcons"
              :key="amenity.id"
              class="flex items-center text-gray-600"
            >
              <div class="w-6 h-6 mr-2 flex items-center justify-center">
                <component :is="amenity.icon" class="h-5 w-5" />
              </div>
              {{ amenity.name }}
            </div>
          </div>
        </div>

        <div
          class="flex flex-col md:flex-row md:items-center justify-between mt-4"
        >
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
import type { Smjestaj, SmjestajSadrzaj } from "~/types/directus/index";

interface SmjestajCardProps {
  smjestaj: Smjestaj;
  getThumbnailUrl: (smjestaj: Smjestaj) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
}

// Define amenity icon keys as a type for better TypeScript support
type AmenityIconKey =
  | "bazen"
  | "klima"
  | "parking"
  | "wifi"
  | "sauna"
  | "tenis"
  | "caffe"
  | "wellness"
  | "restoran"
  | "default";

// Define a mapping of amenity types to SVG icons
const amenityIcons: Record<AmenityIconKey, (props: any) => any> = {
  bazen: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-5 7h4a2 2 0 002-2v-1a2 2 0 00-2-2h-4",
        }),
      ]
    ),
  klima: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M15 9.5A1.5 1.5 0 0013.5 11h-3A1.5 1.5 0 009 9.5m6 0A1.5 1.5 0 0016.5 8h-9A1.5 1.5 0 006 9.5m9 0v2m-9-2v2M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z",
        }),
      ]
    ),
  parking: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M8 7h8v10H8V7z",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M16 6v12M8 6v12M4 8h16M4 16h16",
        }),
      ]
    ),
  wifi: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.07c3.904-3.905 10.246-3.905 14.15 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
        }),
      ]
    ),
  sauna: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M14.929 5.757a2 2 0 00-2.828 0l-6.364 6.364a2 2 0 102.828 2.828L14.93 8.585a2 2 0 000-2.828z",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M5.636 17.364a2 2 0 102.828 2.828l6.364-6.364a2 2 0 00-2.828-2.828L5.636 17.364z",
        }),
      ]
    ),
  tenis: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("circle", {
          cx: "12",
          cy: "12",
          r: "10",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M5.52 18.48C7.61 16.39 10 14 12 12s4.39-4.39 6.48-6.48",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M18.48 18.48C16.39 16.39 14 14 12 12S7.61 7.61 5.52 5.52",
        }),
      ]
    ),
  caffe: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m0 5v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5m2-3h8M5 21h14",
        }),
      ]
    ),
  wellness: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
        }),
      ]
    ),
  restoran: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
        }),
      ]
    ),
  // Default icon for any other amenities
  default: (props) =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        ...props,
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M5 13l4 4L19 7",
        }),
      ]
    ),
};

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

    // Helper function to check if a string contains one of the key amenities
    const getAmenityKey = (amenityName: string): AmenityIconKey => {
      const amenityKeys = Object.keys(amenityIcons).filter(
        (key) => key !== "default"
      ) as AmenityIconKey[];

      for (const key of amenityKeys) {
        if (amenityName.toLowerCase().includes(key.toLowerCase())) {
          return key;
        }
      }

      return "default";
    };

    // Computed property to get all amenities with their corresponding icons
    const amenitiesWithIcons = computed(() => {
      if (!smjestaj.sadrzaji || !Array.isArray(smjestaj.sadrzaji)) {
        return [];
      }

      return smjestaj.sadrzaji
        .filter((item) => item.sadrzaj && item.sadrzaj.naziv)
        .map((item) => {
          const amenityName = item.sadrzaj!.naziv;
          const amenityKey = getAmenityKey(amenityName);

          return {
            id: item.id,
            name: amenityName,
            icon: amenityIcons[amenityKey],
          };
        });
    });

    return {
      isFavorite,
      toggleFavorite,
      amenitiesWithIcons,
    };
  },
});
</script>
