<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="text-gray-500">Loading accommodations...</div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
      {{ error }}
    </div>

    <div v-else-if="smjestaji.length === 0" class="text-center py-12">
      <p class="text-gray-600">
        No accommodations found matching your criteria.
      </p>
    </div>

    <div v-else>
      <div class="space-y-6 mb-8">
        <SmjestajCard
          v-for="smjestaj in paginatedItems"
          :key="smjestaj.id"
          :smjestaj="smjestaj"
          :get-thumbnail-url="getThumbnailUrl"
          :format-price="formatPrice"
          :format-price-h-r-k="formatPriceHRK"
          :get-sadrzaj-icon-url="getSadrzajIconUrl"
        />
      </div>

      <!-- Pagination controls -->
      <div v-if="totalPages > 1" class="flex justify-center items-center py-8">
        <nav class="flex items-center gap-1">
          <!-- Previous page button -->
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-md"
            :class="
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-primary-100 hover:text-white'
            "
          >
            <span class="sr-only">Previous</span>
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

          <!-- Page numbers -->
          <div v-for="(page, index) in displayedPages" :key="index">
            <button
              v-if="page !== '...'"
              @click="goToPage(Number(page))"
              class="px-3 py-1 rounded-md"
              :class="
                currentPage === page
                  ? 'bg-primary-50 text-white font-medium text-sm'
                  : 'hover:bg-primary-100 hover:text-white'
              "
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500">...</span>
          </div>

          <!-- Next page button -->
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-md"
            :class="
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100'
            "
          >
            <span class="sr-only">Next</span>
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
        </nav>
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
import { usePagination } from "~/composables/pagination/usePagination";

import type { SmjestajGridProps } from "~/types/pages/smjestaj-grid";

export default defineComponent({
  props: {
    smjestaji: {
      type: Array as PropType<SmjestajWithRelations[]>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    error: {
      type: String as PropType<string | null>,
      default: null,
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
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },

  setup(props: SmjestajGridProps) {
    // Create reactive reference to props.smjestaji
    const smjestajiRef = computed(() => props.smjestaji);

    // Use pagination composable
    const {
      currentPage,
      totalPages,
      paginatedItems,
      goToPage,
      nextPage,
      prevPage,
      displayedPages,
    } = usePagination(smjestajiRef, props.itemsPerPage);

    // Reset to first page when filters change
    watch(
      () => props.smjestaji,
      () => {
        if (currentPage.value !== 1) {
          goToPage(1);
        }
      },
      { deep: true }
    );

    return {
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
