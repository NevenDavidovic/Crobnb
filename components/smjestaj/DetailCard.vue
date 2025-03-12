<template>
  <div
    class="bg-white rounded-lg w-[279px] overflow-hidden border border-gray-5"
  >
    <!-- Card Image -->
    <div class="relative w-full rounded-lg overflow-hidden">
      <img
        :src="item.imageUrl"
        :alt="item.name"
        class="w-full h-48 object-cover"
      />
    </div>

    <!-- Card Details -->
    <div class="p-4 flex flex-col gap-2">
      <!-- Item Type -->
      <div class="text-gray-500 text-xs uppercase tracking-wide">
        {{ item.type }}
      </div>
      <div class="flex flex-col gap-1">
        <!-- Star Rating -->
        <div class="flex">
          <span
            v-for="i in item.rating"
            :key="`star-${i}`"
            class="text-yellow-400 text-sm"
            >★</span
          >
        </div>

        <!-- Item Name -->
        <h3 class="text-[20px] font-bold text-gray-800">{{ item.name }}</h3>
      </div>
      <!-- Price Information -->
      <div class="mt-2 flex flex-col">
        <div class="text-gray-500 text-xs">od</div>
        <div class="text-gray-100 font-bold text-base">
          {{ formatPrice(item.price) }}
        </div>
        <div class="text-gray-80 text-sm">
          {{ formatPriceHRK(item.price) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useSmjestaji } from "~/composables/useSmjestaji";
import type { DetailItem } from "~/types/pages/detail-item";

export default defineComponent({
  name: "DetailCard",
  props: {
    item: {
      type: Object as PropType<DetailItem>,
      required: true,
      validator: (obj: PropType<DetailItem>): boolean => {
        return (
          "imageUrl" in obj &&
          "name" in obj &&
          "type" in obj &&
          "rating" in obj &&
          "price" in obj
        );
      },
    },
  },
  setup() {
    const { formatPrice, formatPriceHRK } = useSmjestaji();

    return {
      formatPrice,
      formatPriceHRK,
    };
  },
});
</script>
