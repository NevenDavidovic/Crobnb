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

    <div v-else class="space-y-6">
      <SmjestajCard
        v-for="smjestaj in smjestaji"
        :key="smjestaj.id"
        :smjestaj="smjestaj"
        :get-thumbnail-url="getThumbnailUrl"
        :format-price="formatPrice"
        :format-price-h-r-k="formatPriceHRK"
        :get-sadrzaj-icon-url="getSadrzajIconUrl"
      />
    </div>
  </div>
</template>

<script lang="ts">
import type {
  Smjestaj,
  Sadrzaj,
  SmjestajWithRelations,
} from "~/types/directus/index";

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
  },

  setup() {
    return {};
  },
});
</script>
