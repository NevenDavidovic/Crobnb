<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-6">Novosti</h1>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="kategorijeNovosti.length > 0" class="mb-8">
        <div class="flex flex-wrap gap-2">
          <button
            class="px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
            :class="
              selectedCategory === null
                ? 'bg-primary-80 text-white'
                : 'bg-white border border-gray-5 hover:bg-primary-5 text-primary-80'
            "
            @click="setCategory(null)"
          >
            <svg
              v-if="selectedCategory === null"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Sve novosti
          </button>
          <button
            v-for="category in kategorijeNovosti"
            :key="category.id"
            class="px-3 py-3 rounded-lg text-sm transition-colors flex items-center"
            :class="
              selectedCategory === category.id
                ? 'bg-primary-80 text-white'
                : 'bg-white border border-gray-5 hover:bg-primary-5 text-primary-80'
            "
            @click="setCategory(category.id)"
          >
            <svg
              v-if="selectedCategory === category.id"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {{ category.naziv }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="novost in paginatedItems" :key="novost.id">
          <NovostCard
            :novost="novost"
            :get-hero-image-url="getHeroImageUrl"
            :format-date="formatDate"
          />
        </div>
      </div>

      <div v-if="filteredNovosti.length === 0" class="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 4-7-4m14 8a2 2 0 100-4 2 2 0 000 4z"
          />
        </svg>
        <p class="text-gray-500 text-lg">
          {{
            selectedCategory === null
              ? "Nema novosti za prikaz."
              : "Nema novosti u odabranoj kategoriji."
          }}
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center space-x-2 mt-12"
      >
        <!-- Previous button -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-md border border-gray-300 transition-colors"
          :class="
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-primary-5'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div class="flex space-x-1">
          <div v-for="(page, index) in displayedPages" :key="index">
            <button
              v-if="page !== '...'"
              @click="goToPage(Number(page))"
              class="min-w-[40px] h-10 flex items-center justify-center px-3 py-2 rounded-md transition-colors"
              :class="
                currentPage === page
                  ? 'bg-primary-80 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-primary-5'
              "
            >
              {{ page }}
            </button>
            <span
              v-else
              class="min-w-[40px] h-10 flex items-center justify-center px-3 py-2 text-gray-500"
              >...</span
            >
          </div>
        </div>

        <!-- Next button -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-md border border-gray-300 transition-colors"
          :class="
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-primary-5'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePagination } from "~/composables/pagination/usePagination";
import type { Novost } from "~/types/directus/index";

export default defineComponent({
  setup() {
    const {
      novosti,
      kategorijeNovosti,
      isLoading,
      error,
      fetchNovosti,
      fetchNovostiByKategorija,
      fetchKategorijeNovosti,
      getHeroImageUrl,
      formatDate,
    } = useNovosti();

    const selectedCategory = ref<number | null>(null);

    const filteredNovosti = computed(() => {
      if (selectedCategory.value === null) {
        return novosti.value;
      }
      return novosti.value.filter(
        (novost: Novost) =>
          novost.kategorija_novosti_id === selectedCategory.value
      );
    });

    const ITEMS_PER_PAGE = 9;
    const {
      currentPage,
      totalPages,
      paginatedItems,
      goToPage,
      nextPage,
      prevPage,
      displayedPages,
    } = usePagination(filteredNovosti, ITEMS_PER_PAGE);

    const setCategory = async (categoryId: number | null) => {
      selectedCategory.value = categoryId;

      if (categoryId === null) {
        await fetchNovosti();
      } else {
        await fetchNovostiByKategorija(categoryId);
      }

      goToPage(1);
    };

    onMounted(async () => {
      await fetchKategorijeNovosti();
      await fetchNovosti();
    });

    useHead({
      title: "Novosti | Otkrij Hrvatsku",
      meta: [
        {
          name: "description",
          content:
            "Najnovije vijesti i događanja u Hrvatskoj. Budite u toku s najnovijim događajima.",
        },
      ],
    });

    return {
      novosti,
      kategorijeNovosti,
      isLoading,
      error,
      selectedCategory,
      filteredNovosti,
      setCategory,
      getHeroImageUrl,
      formatDate,
      // Pagination
      currentPage,
      totalPages,
      paginatedItems,
      goToPage,
      nextPage,
      prevPage,
      displayedPages,
    };
  },
});
</script>
