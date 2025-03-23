<template>
  <div>
    <div v-if="isLoading" class="text-center py-16">
      <p class="text-xl">Učitavanje regije...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-xl text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="currentRegija">
      <div
        class="relative h-80 w-full bg-cover bg-center"
        :style="{ backgroundImage: `url('${getHeroImage() || ''}')` }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"
        ></div>

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

      <div class="container mx-auto max-w-1200 py-12 px-4">
        <h2 class="text-2xl font-bold mb-8">O regiji</h2>

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
import type { SmjestajWithRelations, Regija } from "~/types/directus/index";

export default defineComponent({
  name: "RegijaPage",

  setup() {
    const route = useRoute();
    const slug = computed(() => route.params.slug as string);

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

    const smjestajiComposable = useSmjestaji();
    const {
      smjestaji,
      availableSmjestaji,
      isLoading: smjestajIsLoading,
      error: smjestajError,
      fetchSmjestajiByRegija,
    } = smjestajiComposable;

    const typedSmjestaji = computed<SmjestajWithRelations[]>(
      () => smjestaji.value as unknown as SmjestajWithRelations[]
    );

    const otherRegions = computed<Regija[]>(() => {
      return regije.value.filter(
        (regija: { id: number }) => regija.id !== currentRegija.value?.id
      );
    });

    const currentPage = ref(1);
    const itemsPerPage = 10;
    const hasMoreSmjestaji = ref(false);

    const getHeroImage = () => {
      if (currentRegija.value?.slika) {
        return getImageUrl(currentRegija.value);
      }
      return "/images/default-region-hero.jpg";
    };

    const loadMoreSmjestaji = async () => {
      if (currentRegija.value?.id) {
        currentPage.value++;
        await fetchSmjestajiByRegija(
          currentRegija.value.id,
          currentPage.value * itemsPerPage
        );
      }
    };
    const { formatPrice, formatPriceHRK } = usePriceFormatters();
    const { getThumbnailUrl, getSadrzajIconUrl } = smjestajiComposable;

    onMounted(async () => {
      await fetchRegije();

      if (slug.value) {
        await fetchRegijaBySlug(slug.value);

        if (currentRegija.value?.id) {
          await fetchSmjestajiByRegija(currentRegija.value.id, itemsPerPage);

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
