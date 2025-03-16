<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-16">
      <p class="text-xl">Učitavanje regije...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-xl text-red-500">{{ error }}</p>
    </div>

    <!-- Content when data is loaded -->
    <div v-else-if="currentRegija">
      <!-- Hero banner with image as background and title (full width) -->
      <div
        class="relative h-80 w-full bg-cover bg-center"
        :style="{ backgroundImage: `url('${getHeroImage() || ''}')` }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"
        ></div>

        <!-- Hero content constrained to max-w-1200 -->
        <div class="absolute inset-0 flex items-end">
          <div class="container mx-auto max-w-1200 px-4 pb-8">
            <div class="flex items-center text-white mb-2">
              <NuxtLink to="/regije" class="flex items-center hover:underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Nazad na Regije
              </NuxtLink>
            </div>
            <h1 class="text-4xl font-bold text-white">
              {{ currentRegija.naziv }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Main content constrained to max-w-1200 -->
      <div class="container mx-auto max-w-1200 py-12 px-4">
        <h2 class="text-2xl font-bold mb-8">O regiji</h2>

        <!-- Main region information -->
        <div class="mb-12">
          <h3 class="text-xl font-semibold mb-4">{{ currentRegija.naziv }}</h3>
          <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2" v-html="currentRegija.opis"></div>
          </div>
        </div>

        <div class="mb-12 md:mt-12">
          <h3 class="text-xl font-semibold mb-6">Smještaji u regiji</h3>

          <SmjestajGrid
            :smjestaji="typedSmjestaji"
            :is-loading="smjestajIsLoading"
            :error="smjestajError"
            :get-thumbnail-url="getThumbnailUrl"
            :format-price="formatPrice"
            :format-price-h-r-k="formatPriceHRK"
            :get-sadrzaj-icon-url="getSadrzajIconUrl"
            :items-per-page="itemsPerPage"
            :use-mobile-layout="true"
          />

          <!-- Show more button if needed -->
          <div
            v-if="smjestaji.length && hasMoreSmjestaji"
            class="mt-8 flex justify-center"
          >
            <button
              @click="loadMoreSmjestaji"
              class="bg-primary-80 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-md transition"
              :disabled="smjestajIsLoading"
            >
              {{
                smjestajIsLoading ? "Učitavanje..." : "Učitaj više smještaja"
              }}
            </button>
          </div>
        </div>

        <!-- Other regions section -->
        <div class="mt-20 mb-12">
          <h3 class="text-xl font-semibold mb-6">Ostale regije Hrvatske</h3>
          <HomepageRegijeGrid
            :regije="otherRegions"
            :is-loading="isLoading"
            :error="error"
            :get-image-url="getImageUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRegije } from "~/composables/useRegije";
import { useSmjestaji } from "~/composables/useSmjestaji";
import type { SmjestajWithRelations, Regija } from "~/types/directus/index";

export default defineComponent({
  name: "RegijaPage",

  setup() {
    const route = useRoute();
    const slug = computed(() => route.params.slug as string);

    // Get region data using the composable
    const regijeComposable = useRegije();
    const {
      regije,
      currentRegija,
      isLoading,
      error,
      fetchRegijaBySlug,
      fetchRegije,
      getImageUrl,
    } = regijeComposable;

    // Get accommodations data using the composable
    const smjestajiComposable = useSmjestaji();
    const {
      smjestaji,
      availableSmjestaji,
      isLoading: smjestajIsLoading,
      error: smjestajError,
      fetchSmjestajiByRegija,
    } = smjestajiComposable;

    // Create a typed version of the smjestaji array to avoid TypeScript errors
    const typedSmjestaji = computed<SmjestajWithRelations[]>(
      () => smjestaji.value as unknown as SmjestajWithRelations[]
    );

    // Compute other regions (all regions except the current one)
    const otherRegions = computed<Regija[]>(() => {
      return regije.value.filter(
        (regija: { id: number }) => regija.id !== currentRegija.value?.id
      );
    });

    // Pagination for accommodations
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const hasMoreSmjestaji = ref(false);

    // Function to get a hero image (either the region image or a default)
    const getHeroImage = () => {
      if (currentRegija.value?.slika) {
        return getImageUrl(currentRegija.value);
      }
      return "/images/default-region-hero.jpg"; // Fallback image
    };

    // Function to load more accommodations
    const loadMoreSmjestaji = async () => {
      if (currentRegija.value?.id) {
        currentPage.value++;
        await fetchSmjestajiByRegija(
          currentRegija.value.id,
          currentPage.value * itemsPerPage
        );
      }
    };

    // Using the existing utility functions from useSmjestaji
    const { formatPrice, formatPriceHRK, getThumbnailUrl, getSadrzajIconUrl } =
      smjestajiComposable;

    // Fetch the region data when the component mounts
    onMounted(async () => {
      // Fetch all regions to be able to display other regions
      await fetchRegije();

      if (slug.value) {
        await fetchRegijaBySlug(slug.value);

        // After region is loaded, fetch accommodations in that region
        if (currentRegija.value?.id) {
          await fetchSmjestajiByRegija(currentRegija.value.id, itemsPerPage);

          // Check if there might be more items to load
          hasMoreSmjestaji.value = smjestaji.value.length >= itemsPerPage;
        }
      }
    });

    return {
      currentRegija,
      isLoading,
      error,
      slug,
      getImageUrl,
      getHeroImage,
      smjestaji,
      typedSmjestaji,
      smjestajIsLoading,
      smjestajError,
      hasMoreSmjestaji,
      loadMoreSmjestaji,
      formatPrice,
      formatPriceHRK,
      getThumbnailUrl,
      getSadrzajIconUrl,
      itemsPerPage,
      otherRegions,
      regije,
    };
  },
});
</script>
