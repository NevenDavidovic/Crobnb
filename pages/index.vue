<template>
  <div>
    <HomepageHeroSection class="hidden md:block" />
    <SearchFilterComponent
      :tipovi="tipovi"
      :tipovi-loading="tipoviLoading"
      :tipovi-error="tipoviError || undefined"
      :regije="regije"
      :regije-loading="regijeLoading"
      :regije-error="regijeError || undefined"
      @search="onSearch"
    />

    <div class="max-w-1200 mx-auto pt-24 px-4 pb-16">
      <h1 class="text-2xl font-bold mb-8">Tip smještaja</h1>
      <HomepageTipoviSmjestaja
        :tipovi="tipovi"
        :is-loading="tipoviLoading"
        :error="tipoviError"
        :get-icon-url="getIconUrl"
      />
    </div>

    <div class="max-w-1200 mx-auto py-8 px-4 mb-8">
      <h1 class="text-2xl font-bold mb-8">Regije Hrvatske</h1>
      <HomepageRegijeGrid
        :regije="regije"
        :is-loading="regijeLoading"
        :error="regijeError"
        :get-image-url="getImageUrl"
      />
    </div>

    <div class="mx-auto py-16 bg-primary-5">
      <div class="mx-auto px-4">
        <div
          class="flex justify-between items-center mb-8 md:px-4 max-w-1200 mx-auto"
        >
          <h1 class="text-2xl font-bold">Novosti</h1>
          <NuxtLink
            to="#"
            class="text-blue-600 hover:text-blue-800 flex items-center"
          >
            Vidi sve novosti
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
          </NuxtLink>
        </div>

        <NovostiGrid
          class="md:max-w-[1300px] md:mx-auto md:px-4"
          :novosti="novosti"
          :is-loading="novostiLoading"
          :error="novostiError"
          :get-hero-image-url="getHeroImageUrl"
          :format-date="formatDate"
        />
      </div>
    </div>
    <HomepageAboutUs class="mb-44" />
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useRegije } from "~/composables/useRegije";
import { useNovosti } from "~/composables/useNovosti";
import type { SearchFilters } from "~/types/pages/search-filter";

export default defineComponent({
  setup() {
    const {
      tipovi,
      isLoading: tipoviLoading,
      error: tipoviError,
      fetchTipovi,
      getIconUrl,
    } = useTipoviSmjestaja();

    const {
      regije,
      isLoading: regijeLoading,
      error: regijeError,
      fetchRegije,
      getImageUrl,
    } = useRegije();

    const {
      novosti,
      isLoading: novostiLoading,
      error: novostiError,
      fetchNovosti,
      getHeroImageUrl,
      formatDate,
    } = useNovosti();

    onMounted(() => {
      fetchTipovi();
      fetchRegije();
      fetchNovosti(9);
    });
    const onSearch = (filters: SearchFilters): void => {
      console.log("Search filters received:", filters);

      const queryParams: Record<string, string> = {
        location: filters.location,
        type: filters.type,
        checkin: filters.checkin,
        checkout: filters.checkout,
        adults: filters.adults,
        children: filters.children,
      };

      navigateTo({
        path: "/smjestaji",
        query: queryParams,
      });
    };

    return {
      tipovi,
      tipoviLoading,
      tipoviError,
      getIconUrl,

      regije,
      regijeLoading,
      regijeError,
      getImageUrl,

      novosti,
      novostiLoading,
      novostiError,
      getHeroImageUrl,
      formatDate,
      onSearch,
    };
  },
});
</script>
