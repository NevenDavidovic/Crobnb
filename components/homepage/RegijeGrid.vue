<template>
  <div v-if="isLoading" class="flex justify-center py-4">
    <div class="text-gray-500">Loading regions...</div>
  </div>

  <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
    {{ error }}
  </div>

  <div v-else-if="regije.length === 0" class="text-center py-8">
    <p class="text-gray-600">No regions found.</p>
  </div>

  <div v-else>
    <div class="block md:hidden">
      <ClientOnly>
        <swiper-container
          ref="swiperRef"
          :slides-per-view="1.2"
          :space-between="16"
          :pagination="false"
          :navigation="false"
          :breakpoints="{
            '480': {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
          }"
          class="pb-[20px] lg:px-4"
        >
          <swiper-slide
            v-for="regija in regije"
            :key="regija.id"
            class="pb-4 h-auto md:max-w-[100%] max-w-[85%]"
          >
            <NuxtLink
              :to="`/regije/${regija.slug || regija.id}`"
              class="block relative group"
            >
              <div class="relative rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  v-if="getImageUrl(regija) !== null"
                  :src="getImageUrl(regija) || undefined"
                  :alt="regija.naziv"
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
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div class="absolute inset-x-0 bottom-0">
                  <div
                    class="flex justify-between items-center w-full text-white bg-gradient-to-r from-black/30 to-black/30 rounded px-3 py-2"
                  >
                    <h3 class="font-medium text-[22px]">{{ regija.naziv }}</h3>
                    <div class="text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
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
              </div>
            </NuxtLink>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>

    <div class="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="regija in regije"
        :key="regija.id"
        :to="`/regije/${regija.slug || regija.id}`"
        class="block relative group"
      >
        <div class="relative rounded-lg overflow-hidden aspect-[4/3]">
          <img
            v-if="getImageUrl(regija) !== null"
            :src="getImageUrl(regija) || undefined"
            :alt="regija.naziv"
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
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div class="absolute inset-x-0 bottom-0">
            <div
              class="flex justify-between items-center w-full text-white bg-gradient-to-r from-black/30 to-black/30 rounded px-3 py-2"
            >
              <h3 class="font-medium text-[22px]">{{ regija.naziv }}</h3>
              <div class="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts">
import type { Regija } from "~/types/directus/index";

export default defineComponent({
  props: {
    regije: {
      type: Array as PropType<Regija[]>,
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
    getImageUrl: {
      type: Function as PropType<(regija: Regija) => string | null>,
      required: true,
    },
  },

  setup() {
    const swiperRef = ref(null);

    return {
      swiperRef,
    };
  },
});
</script>
