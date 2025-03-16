<template>
  <div class="max-w-1200 mx-auto md:px-4 py-12">
    <h1 class="text-[40px] font-bold px-4 md:px-0 mb-12">Regije u Hrvatskoj</h1>

    <div v-if="isLoading" class="flex justify-center items-center py-20 px-4">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500 px-4">
      {{ error }}
    </div>

    <div v-else>
      <div class="space-y-16 md:rounded-lg felx flex-col md:gap-[88px]">
        <div
          v-for="(regija, index) in regije"
          :key="regija.id"
          class="flex flex-col md:flex-row gap-0 rounded-lg overflow-hidden shadow-sm"
          :class="{ 'md:flex-row-reverse': index % 2 !== 0 }"
        >
          <div class="md:w-[55%]">
            <img
              v-if="getSafeImageUrl(regija)"
              :src="getSafeImageUrl(regija)"
              :alt="regija.naziv"
              class="w-full h-64 md:h-full object-cover"
            />
            <div
              v-else
              class="w-full h-64 md:h-full bg-gray-5 flex items-center justify-center"
            >
              <span class="text-gray-400">Nema slike</span>
            </div>
          </div>

          <div
            class="md:w-[45%] py-4 bg-gray-50 px-4 md:px-0"
            :class="
              index % 2 !== 0
                ? 'md:pr-16 md:pl-[32px]'
                : 'md:pr-[32px] md:pl-16'
            "
          >
            <h2 class="text-[32px] text-gray-100 font-bold mb-6">
              {{ regija.naziv }}
            </h2>
            <p class="text-gray-80 text-base mb-6 leading-relaxed">
              {{ regija.kratki_opis }}
            </p>
            <NuxtLink
              :to="`/regija/${regija.slug}`"
              class="text-primary-80 flex items-center gap-1 hover:text-primary-dark transition-colors font-medium text-base"
            >
              Vidi detalje
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
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
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Regija } from "~/types/directus/index";

export default defineComponent({
  setup() {
    const { regije, isLoading, error, fetchRegije, getImageUrl } = useRegije();

    const getSafeImageUrl = (regija: Regija): string | undefined => {
      const url = getImageUrl(regija);
      return url === null ? undefined : url;
    };

    onMounted(async () => {
      await fetchRegije();
    });

    useHead({
      title: "Regije Hrvatske | Otkrij Hrvatsku",
      meta: [
        {
          name: "description",
          content:
            "Istražite prekrasne regije Hrvatske - od Istre i Kvarnera do Dalmacije i kontinentalne Hrvatske.",
        },
      ],
    });

    return {
      regije,
      isLoading,
      error,
      getSafeImageUrl,
    };
  },
});
</script>
