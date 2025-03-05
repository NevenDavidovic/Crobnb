<template>
  <NuxtLink
    :to="`/novosti/${novost.slug || novost.id}`"
    class="block overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div class="relative h-48 overflow-hidden">
      <img
        v-if="getHeroImageUrl(novost) !== null"
        :src="getHeroImageUrl(novost) || undefined"
        :alt="novost.naslov"
        class="w-full h-full object-cover"
      />

      <div
        v-else
        class="w-full h-full bg-gray-200 flex items-center justify-center"
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 4-7-4m14 8a2 2 0 100-4 2 2 0 000 4z"
          />
        </svg>
      </div>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-center mb-2 text-sm">
        <span
          v-if="novost.kategorija_novosti?.naziv"
          class="text-gray-500 uppercase"
        >
          {{ novost.kategorija_novosti.naziv }}
        </span>
        <span v-else class="text-gray-500 uppercase">Općenito</span>
        <span class="text-gray-500">{{ formatDate(novost.date_created) }}</span>
      </div>

      <h3 class="text-lg font-semibold mb-2 text-gray-800">
        {{ novost.naslov }}
      </h3>

      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ novost.kratki_opis }}
      </p>

      <div class="flex items-center text-blue-600 text-sm font-medium">
        <span>Vidi više</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import type { Novost } from "~/types/directus/index";

export default defineComponent({
  props: {
    novost: {
      type: Object as PropType<Novost>,
      required: true,
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

  setup() {},
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
