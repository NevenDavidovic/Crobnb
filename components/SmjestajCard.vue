<template>
  <div
    class="border border-gray-5 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 p-6 max-w-[800px] mx-auto w-full"
  >
    <div class="flex flex-col md:flex-row relative gap-8">
      <!-- Left column: Image -->
      <div class="w-full md:w-1/3 relative">
        <button
          class="absolute top-3 right-3 p-2 block md:hidden rounded-3xl bg-white"
          @click="toggleFavorite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            :class="isFavorite ? 'text-red-500' : 'text-teal-700'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <img
          v-if="getThumbnailUrl(smjestaj) !== null"
          :src="getThumbnailUrl(smjestaj) || undefined"
          :alt="smjestaj.naziv"
          class="w-full h-64 md:h-full object-cover rounded-md"
        />
        <div
          v-else
          class="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center rounded-md"
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
      </div>

      <!-- Right column: Details -->
      <div class="w-full md:w-2/3 flex flex-col justify-between relative">
        <!-- Favorite button moved to top right outside of image -->
        <button
          class="absolute top-0 right-0 p-2 hidden md:block"
          @click="toggleFavorite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            :class="isFavorite ? 'text-red-500' : 'text-teal-700'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <div>
          <!-- Type label -->
          <div class="text-xs text-gray-60 uppercase mb-1">
            {{ smjestaj.tip_smjestaja?.naziv || "SMJEŠTAJ" }}
          </div>

          <div class="flex gap-3 items-center mb-2">
            <h3 class="text-[22px] font-bold text-gray-100">
              {{ smjestaj.naziv }}
            </h3>
            <div class="flex">
              <span
                v-for="i in smjestaj.broj_zvjezdica || 5"
                :key="i"
                class="text-xl text-yellow-400"
                >★</span
              >
              <span
                v-for="i in 5 - (smjestaj.broj_zvjezdica || 5)"
                :key="`empty-${i}`"
                class="text-xl text-gray-300"
                >★</span
              >
            </div>
          </div>

          <!-- Address -->
          <p class="text-sm text-gray-60 mb-8">
            {{ smjestaj.adresa }}, {{ smjestaj.postanski_broj }}
            {{ smjestaj.grad }}, {{ smjestaj.regija?.naziv || "Hrvatska" }}
          </p>

          <!-- Amenities -->
          <div v-if="amenities.length > 0" class="flex flex-wrap gap-3 mb-8">
            <div
              v-for="sadrzaj in amenities"
              :key="sadrzaj.id"
              class="flex items-center text-gray-600"
            >
              <img
                v-if="
                  getSadrzajIconUrl &&
                  getSadrzajIconUrl(sadrzaj) &&
                  typeof sadrzaj.icon === 'object'
                "
                :src="getSadrzajIconUrl(sadrzaj) || undefined"
                class="w-6 h-6 mr-2 object-contain text-lg text-gray-60"
                alt=""
              />

              <span
                v-else-if="sadrzaj.icon && typeof sadrzaj.icon === 'string'"
                class="material-icons mr-2 text-lg text-gray-60"
              >
                {{ sadrzaj.icon }}
              </span>
              <span class="text-gray-80 text-xs">{{ sadrzaj.naziv }}</span>
            </div>
          </div>

          <!-- Message when no amenities are available -->
          <div v-else class="text-gray-500 text-base mb-8">
            Nema dostupnih sadržaja
          </div>
        </div>

        <!-- Button and price in separate row with button on left and price on right -->
        <div class="flex justify-between items-center mt-6">
          <!-- Button moved to the left -->
          <NuxtLink
            :to="detailsLink"
            class="bg-primary-80 hover:bg-teal-700 text-white font-medium text-xs py-3 px-4 rounded-md transition"
          >
            Pogledaj detalje
          </NuxtLink>

          <!-- Price section -->
          <div class="text-right">
            <div class="text-base font-bold text-gray-100">
              {{ formatPrice(smjestaj.cijena_nocenja) }}
            </div>
            <div class="text-xs text-gray-60">
              {{ formatPriceHRK(smjestaj.cijena_nocenja) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type {
  Smjestaj,
  Sadrzaj,
  SmjestajWithRelations,
} from "~/types/directus/index";
import type { SmjestajCardProps } from "~/types/pages/smjestaj-card";

export default defineComponent({
  // Props remain unchanged
  props: {
    smjestaj: {
      type: Object as PropType<SmjestajWithRelations>,
      required: true,
    },
    getThumbnailUrl: {
      type: Function as PropType<
        (smjestaj: SmjestajWithRelations | Smjestaj) => string | null
      >,
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
    getSadrzajIconUrl: {
      type: Function as PropType<(sadrzaj: Sadrzaj) => string | null>,
      default: null,
    },
  },

  setup(props: SmjestajCardProps) {
    const route = useRoute();
    const isFavorite = ref(false);

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
    };

    // Get route query parameters
    const detailsLink = computed(() => {
      const baseUrl = `/smjestaj/${props.smjestaj.slug || props.smjestaj.id}`;

      // Get checkin and checkout from route query params if they exist
      const query = route.query;
      const queryParams = new URLSearchParams();

      // Add checkin parameter if it exists
      if (query.checkin) {
        queryParams.append("checkin", query.checkin as string);
      }

      // Add checkout parameter if it exists
      if (query.checkout) {
        queryParams.append("checkout", query.checkout as string);
      }

      // Convert queryParams to string and append if not empty
      const queryString = queryParams.toString();
      return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    });

    const amenities = computed(() => {
      if (
        !props.smjestaj.smjestaj_sadrzaji ||
        !Array.isArray(props.smjestaj.smjestaj_sadrzaji)
      ) {
        return [];
      }

      const result = [];

      for (const item of props.smjestaj.smjestaj_sadrzaji) {
        if (
          item.sadrzaj &&
          typeof item.sadrzaj === "object" &&
          "id" in item.sadrzaj &&
          "naziv" in item.sadrzaj
        ) {
          result.push(item.sadrzaj);
        }
      }

      return result as any[];
    });

    return {
      isFavorite,
      toggleFavorite,
      amenities,
      detailsLink,
    };
  },
});
</script>
