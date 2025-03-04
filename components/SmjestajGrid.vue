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
import type { Smjestaj, Sadrzaj } from "~/types/directus/index";

interface SmjestajGridProps {
  smjestaji: Smjestaj[];
  isLoading: boolean;
  error: string | null;
  getThumbnailUrl: (smjestaj: Smjestaj) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
  getSadrzajIconUrl: (sadrzaj: Sadrzaj) => string | null;
}

export default defineComponent({
  props: {
    smjestaji: {
      type: Array as PropType<Smjestaj[]>,
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
    getSadrzajIconUrl: {
      type: Function as PropType<(sadrzaj: Sadrzaj) => string | null>,
      required: true,
    },
  },

  setup(props: SmjestajGridProps) {
    // Debug on mount
    onMounted(() => {
      console.log("SmjestajGrid - Component mounted");
      console.log(
        "SmjestajGrid - Number of smjestaji:",
        props.smjestaji.length
      );

      // Check the first item if available
      if (props.smjestaji.length > 0) {
        const firstItem = props.smjestaji[0];
        console.log("SmjestajGrid - First smjestaj item:", {
          id: firstItem.id,
          naziv: firstItem.naziv,
          tipovi_smjestaja_id: firstItem.tipovi_smjestaja_id,
          tip_smjestaja: firstItem.tip_smjestaja,
        });
      }
    });

    // Watch for changes in the smjestaji prop
    watch(
      () => props.smjestaji,
      (newValue: Smjestaj[]) => {
        console.log("SmjestajGrid - smjestaji prop changed:", {
          count: newValue.length,
          hasTypeLinks: newValue.some((item) => !!item.tip_smjestaja),
        });

        // Check for missing tip_smjestaja links
        const missingLinks = newValue.filter(
          (item) => item.tipovi_smjestaja_id && !item.tip_smjestaja
        );

        if (missingLinks.length > 0) {
          console.warn(
            `SmjestajGrid - Found ${missingLinks.length} items with tipovi_smjestaja_id but no linked tip_smjestaja object`
          );
          console.log(
            "SmjestajGrid - First missing link item:",
            missingLinks[0]
          );
        }
      },
      { immediate: true, deep: true }
    );

    return {};
  },
});
</script>
