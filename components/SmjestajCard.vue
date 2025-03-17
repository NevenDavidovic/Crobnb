<template>
  <div
    class="border border-gray-5 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 p-6 max-w-[800px] mx-auto w-full"
  >
    <div
      class="flex relative gap-8"
      :class="[useMobileLayout ? 'flex-col' : 'flex-col md:flex-row']"
    >
      <div class="w-full relative" :class="[useMobileLayout ? '' : 'md:w-1/3']">
        <button
          class="absolute top-3 right-3 p-2 rounded-3xl bg-white"
          :class="[useMobileLayout ? '' : 'block md:hidden']"
          @click="toggleFavorite(smjestaj.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            :fill="isFavorite(smjestaj.id) ? '#337589' : 'none'"
            viewBox="0 0 24 24"
            stroke="#337589"
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
          class="w-full h-64 object-cover rounded-md"
          :class="[useMobileLayout ? '' : 'md:h-full']"
        />
        <div
          v-else
          class="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md"
          :class="[useMobileLayout ? '' : 'md:h-full']"
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

      <div
        class="w-full flex flex-col justify-between relative"
        :class="[useMobileLayout ? '' : 'md:w-2/3']"
      >
        <button
          v-if="!useMobileLayout"
          class="absolute top-0 right-0 p-2 hidden md:block"
          @click="toggleFavorite(smjestaj.id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            :fill="isFavorite(smjestaj.id) ? '#337589' : 'none'"
            viewBox="0 0 24 24"
            stroke="#337589"
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

          <p class="text-sm text-gray-60 mb-8">
            {{ smjestaj.adresa }}, {{ smjestaj.postanski_broj }}
            {{ smjestaj.grad }}, {{ smjestaj.regija?.naziv || "Hrvatska" }}
          </p>

          <div
            v-if="amenities.length > 0"
            class="flex flex-wrap gap-3 mb-0"
            :class="[useMobileLayout ? '' : 'md:mb-8']"
          >
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

          <div v-else class="text-gray-500 text-base mb-8">
            Nema dostupnih sadržaja
          </div>
        </div>

        <div
          class="flex gap-3 items-center mt-6"
          :class="[
            useMobileLayout
              ? 'flex-col-reverse'
              : 'flex-col-reverse md:flex-row md:justify-between md:gap-0',
          ]"
        >
          <NuxtLink
            :to="detailsLink"
            class="bg-primary-80 hover:bg-teal-700 text-white font-medium text-center text-xs py-3 px-4 rounded-md transition"
            :class="[useMobileLayout ? 'w-full' : 'w-full md:max-w-[155px]']"
          >
            Pogledaj detalje
          </NuxtLink>

          <div
            class="w-full mb-6"
            :class="[
              useMobileLayout ? 'text-left' : 'text-left md:text-right md:mb-0',
            ]"
          >
            <div class="text-[22px] font-bold text-gray-100">
              {{ formatPrice(smjestaj.cijena_nocenja) }}
            </div>
            <div class="text-sm text-gray-60">
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
  Favoriti,
} from "~/types/directus/index";
import type { SmjestajCardProps } from "~/types/pages/smjestaj-card";

export default defineComponent({
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
    useMobileLayout: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: SmjestajCardProps & { useMobileLayout?: boolean }) {
    const route = useRoute();
    const { addFavorite, removeFavorite, isFavorite, favorites } =
      useFavoriti();

    const toggleFavorite = async (smjestajId: number) => {
      try {
        // Check if the user is authenticated (you may want to handle this)
        const authStore = useAuthStore();
        if (!authStore.user) {
          navigateTo("/auth/prijava");
          return;
        }

        if (isFavorite(smjestajId)) {
          const favorite = favorites.value.find(
            (fav: Favoriti) => fav.smjestaj_id === smjestajId
          );

          if (favorite) {
            await removeFavorite(favorite.id);
          } else {
            console.warn(
              `No favorite record found for smjestaj ID: ${smjestajId}`
            );
          }
        } else {
          await addFavorite(smjestajId);
        }
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    };

    const detailsLink = computed(() => {
      const baseUrl = `/smjestaj/${props.smjestaj.slug || props.smjestaj.id}`;
      const query = route.query;
      const queryParams = new URLSearchParams();

      if (query.checkin) queryParams.append("checkin", query.checkin as string);
      if (query.checkout)
        queryParams.append("checkout", query.checkout as string);
      queryParams.append("adults", (query.adults as string) || "2");
      queryParams.append("children", (query.children as string) || "0");

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
      return props.smjestaj.smjestaj_sadrzaji
        .filter(
          (item) =>
            item.sadrzaj &&
            typeof item.sadrzaj === "object" &&
            "id" in item.sadrzaj &&
            "naziv" in item.sadrzaj
        )
        .map((item) => item.sadrzaj) as Sadrzaj[];
    });

    return {
      isFavorite, // Directly return the isFavorite function from useFavoriti
      toggleFavorite,
      amenities,
      detailsLink,
    };
  },
});
</script>
