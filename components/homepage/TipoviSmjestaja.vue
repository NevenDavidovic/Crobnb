<template>
  <div v-if="isLoading" class="flex justify-center py-8">
    <div class="text-gray-500">Loading accommodation types...</div>
  </div>

  <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
    {{ error }}
  </div>

  <div v-else-if="tipovi.length === 0" class="text-center py-8">
    <p class="text-gray-600">No accommodation types found.</p>
  </div>

  <div
    v-else
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
  >
    <NuxtLink
      v-for="tip in tipovi"
      :key="tip.id"
      :to="`/ponuda-smjestaja/${tip.slug || tip.id}`"
      class="block"
    >
      <div
        class="border rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow text-center"
      >
        <div class="text-teal-700 mb-2">
          <img
            v-if="getIconUrl(tip) !== null"
            :src="getIconUrl(tip) || undefined"
            :alt="tip.naziv"
            class="w-16 h-16 object-contain mx-auto"
          />

          <div v-else class="w-16 h-16 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>

        <div class="flex gap-4 items-center justify-center content-center">
          <div class="text-center">{{ tip.naziv }}</div>

          <div class="flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline-block"
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
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import type { TipSmjestaja } from "~/types/directus/index";

export default defineComponent({
  props: {
    tipovi: {
      type: Array as PropType<TipSmjestaja[]>,
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
    getIconUrl: {
      type: Function as PropType<(tip: TipSmjestaja) => string | null>,
      required: true,
    },
  },
});
</script>
