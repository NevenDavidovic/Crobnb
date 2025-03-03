<template>
  <div>
    <div v-if="isLoading" class="flex justify-center">
      <div class="text-gray-500">Loading news...</div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
      {{ error }}
    </div>

    <div v-else-if="novosti.length === 0" class="text-center py-8">
      <p class="text-gray-600">No news articles found.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NovostCard
        v-for="novost in novosti"
        :key="novost.id"
        :novost="novost"
        :get-hero-image-url="getHeroImageUrl"
        :format-date="formatDate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type { Novost } from "~/types/directus/index";

interface NovostiGridProps {
  novosti: Novost[];
  isLoading: boolean;
  error: string | null;
  getHeroImageUrl: (novost: Novost) => string | null;
  formatDate: (dateString: string) => string;
}

export default defineComponent({
  props: {
    novosti: {
      type: Array as PropType<Novost[]>,
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
    getHeroImageUrl: {
      type: Function as PropType<(novost: Novost) => string | null>,
      required: true,
    },
    formatDate: {
      type: Function as PropType<(dateString: string) => string>,
      required: true,
    },
  },

  setup({
    novosti,
    isLoading,
    error,
    getHeroImageUrl,
    formatDate,
  }: NovostiGridProps) {
    // Add debugging to check what data we're receiving
    onMounted(() => {
      console.log("NovostiGrid - novosti array:", novosti);

      if (novosti.length > 0) {
        console.log("NovostiGrid - First item:", novosti[0]);
        console.log(
          "NovostiGrid - First item has kategorija_novosti?",
          !!novosti[0].kategorija_novosti
        );

        if (novosti[0].kategorija_novosti) {
          console.log(
            "NovostiGrid - First item kategorija_novosti:",
            novosti[0].kategorija_novosti
          );
          console.log(
            "NovostiGrid - First item kategorija_novosti.naziv:",
            novosti[0].kategorija_novosti.naziv
          );
        }

        // Log all novosti items to check which ones have kategorija_novosti
        novosti.forEach((item, index) => {
          console.log(
            `NovostiGrid - Item ${index} (ID: ${item.id}) has kategorija_novosti:`,
            !!item.kategorija_novosti,
            item.kategorija_novosti_id
          );
        });
      }
    });

    return {};
  },
});
</script>
