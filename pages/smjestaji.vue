<template>
  <div class="lg:my-12">
    <SearchFilterComponent
      :is-visible="true"
      :tipovi="tipovi"
      :tipovi-loading="tipoviLoading"
      :tipovi-error="tipoviError || undefined"
      :regije="regije"
      :regije-loading="regijeLoading"
      :regije-error="regijeError || undefined"
      :initial-location="urlParams.location"
      :initial-type="urlParams.type"
      :initial-checkin="urlParams.checkin"
      :initial-checkout="urlParams.checkout"
      :initial-adults="urlParams.adults"
      :initial-children="urlParams.children"
      @search="onSearch"
    />

    <div class="px-4 max-w-1200 lg:hidden flex space-x-4">
      <button
        @click="showFilter"
        class="flex gap-3 items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-gray-600 bg-white w-full hover:bg-gray-50"
      >
        <svg
          width="23"
          height="20"
          viewBox="0 0 23 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.5 1H1.5L9.5 10.46V17L13.5 19V10.46L21.5 1Z"
            stroke="#337589"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="font-medium">Filtriraj po</span>
      </button>

      <button
        class="flex items-center gap-3 justify-center px-4 py-3 border border-gray-200 rounded-lg text-gray-600 bg-white w-full hover:bg-gray-50"
      >
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.6422 0.646391L4.64224 0.646347C4.72871 0.55975 4.84241 0.508338 4.96331 0.500644C5.08039 0.493194 5.19621 0.527152 5.2906 0.596331L5.35899 0.656713L9.35413 4.64588L9.35608 4.64781C9.44689 4.73749 9.49996 4.85851 9.50443 4.98605C9.5089 5.11361 9.46442 5.23804 9.38011 5.33385C9.2958 5.42967 9.17803 5.48962 9.05095 5.50142C8.928 5.51283 8.80533 5.47834 8.70646 5.40485L8.636 5.34254L6.35375 3.06327L5.50042 2.21107V3.41706V15.0001V15.0005C5.50053 15.123 5.45562 15.2414 5.37423 15.333C5.29548 15.4216 5.18789 15.4793 5.07075 15.496L4.98811 15.5009C4.87002 15.4979 4.75664 15.4532 4.66821 15.3745C4.5796 15.2956 4.52202 15.1879 4.50554 15.0707L4.50042 14.9851V3.41006V2.20109L3.64649 3.05689L1.35461 5.35377C1.3546 5.35378 1.35459 5.35379 1.35458 5.3538C1.35455 5.35383 1.35452 5.35386 1.35449 5.35389C1.26847 5.43998 1.154 5.49174 1.03254 5.49947C0.915101 5.50695 0.798927 5.47275 0.70437 5.40314L0.637085 5.34436C0.556695 5.25954 0.508451 5.1491 0.501011 5.03218C0.493563 4.91515 0.52749 4.79937 0.596611 4.705L0.657936 4.63564L4.6422 0.646391ZM13.6471 12.9368L14.5004 13.789V12.5831V1.00312C14.5004 1.0031 14.5004 1.00308 14.5004 1.00306C14.5005 0.880617 14.5454 0.76244 14.6268 0.670938C14.7055 0.582393 14.813 0.524785 14.9301 0.50816L15.0127 0.503216C15.1308 0.506181 15.2442 0.550881 15.3326 0.629603C15.4213 0.708511 15.4789 0.816281 15.4953 0.933553L15.5004 1.01814V12.5871V13.7949L16.3541 12.9405L18.6461 10.6465L18.6462 10.6463C18.7323 10.5602 18.8468 10.5084 18.9683 10.5006C19.0857 10.4932 19.2019 10.5274 19.2965 10.597L19.3638 10.6558C19.4442 10.7406 19.4924 10.851 19.4998 10.9679C19.5073 11.085 19.4734 11.2007 19.4042 11.2951L19.3429 11.3645L15.3577 15.3537L15.3576 15.3538C15.2716 15.4399 15.1571 15.4917 15.0355 15.4995C14.9189 15.5069 14.8035 15.4732 14.7092 15.4045L14.641 15.3435L10.6471 11.3536C10.647 11.3536 10.647 11.3535 10.6469 11.3535C10.5572 11.2636 10.505 11.1429 10.501 11.0159C10.497 10.8889 10.5415 10.7651 10.6255 10.6697C10.7095 10.5744 10.8266 10.5145 10.9531 10.5024C11.0751 10.4908 11.197 10.5243 11.2957 10.5964L11.3648 10.6576L13.6471 12.9368Z"
            fill="#337589"
            stroke="#337589"
          />
        </svg>

        <span class="font-medium" @click="openSortModal">Sortiraj po</span>
      </button>
    </div>

    <div
      v-if="showSortModal"
      class="fixed right-0 left-0 top-0 bottom-0 bg-white z-10 lg:hidden"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="max-w-[375px] mx-auto">
        <!-- Drag indicator -->
        <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-4 mb-4"></div>

        <h3 class="text-center text-base text-gray-100 font-medium mt-8 mb-4">
          Sortiraj po
        </h3>
        <div class="py-1">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="setSortOption(option.value)"
            class="w-full px-4 py-2 text-left text-gray-80 hover:text-white hover:bg-primary-100 transition-colors flex items-center"
            :class="{
              'font-medium text-blue-600': sortBy === option.value,
            }"
          >
            <!-- Custom styled radio button -->
            <div
              class="relative w-5 h-5 rounded-full border-2 border-primary-80 flex items-center justify-center mr-2"
              :class="
                sortBy === option.value
                  ? 'border-primary-80'
                  : 'border-gray-300'
              "
            >
              <!-- Inner dot that appears when selected -->
              <div
                v-if="sortBy === option.value"
                class="w-2.5 h-2.5 rounded-full bg-primary-80"
              ></div>
            </div>

            <!-- Keep the original input but hide it visually (for accessibility) -->
            <input
              type="radio"
              :value="option.value"
              :checked="sortBy === option.value"
              @click.stop
              class="sr-only"
            />

            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="flex-col lg:flex-row flex max-w-1200 px-4 mx-auto gap-6 mt-12 w-full"
    >
      <div
        :class="{ block: isFilterVisible, 'hidden lg:block': !isFilterVisible }"
        class="max-w-[380px] w-full"
      >
        <div
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          @click="closeFilter"
        ></div>

        <div
          class="fixed inset-0 z-50 lg:static lg:z-auto overflow-y-auto bg-white lg:rounded-lg lg:border lg:border-gray-5 lg:p-4 lg:max-w-[384px] lg:h-fit w-full"
        >
          <div class="sticky top-0 bg-white z-10 px-4 py-4 lg:px-0">
            <div class="flex justify-between items-center pb-4 border-b">
              <h3 class="font-normal text-gray-100 text-[20px] mb-4">
                Filtriraj po:
              </h3>
              <div class="flex items-center">
                <button
                  @click="resetFilters"
                  class="text-primary-80 text-base mr-4"
                >
                  Resetiraj
                </button>
                <!-- X button to close on mobile -->
                <button
                  @click="closeFilter"
                  class="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="px-4 lg:px-0">
            <div class="mb-6 mt-4 pb-4 border-b">
              <p class="text-gray-100 text-base mb-2">Raspon cijena (EUR)</p>
              <div class="flex justify-between text-gray-500 text-sm mb-1">
                <span>{{ currentPriceMin }}</span>
                <span>{{ currentPriceMax }}</span>
              </div>
              <div class="relative h-2 mb-4 max-w-[80%] lg:max-w-[340px]">
                <div class="absolute w-full h-2 bg-gray-200 rounded"></div>

                <div
                  class="absolute h-2 bg-primary-80 rounded"
                  :style="`width: ${sliderWidth}%; left: ${sliderMinPercent}%`"
                ></div>

                <div
                  class="absolute w-5 h-5 bg-white border-8 border-primary-80 rounded-full -mt-1.5 -ml-1 cursor-pointer"
                  :style="`left: ${sliderMinPercent}%`"
                  @mousedown="startDrag('min', $event)"
                  @touchstart.prevent="startDrag('min', $event)"
                ></div>

                <div
                  class="absolute w-5 h-5 bg-white border-8 border-primary-80 rounded-full -mt-1.5 -ml-1 cursor-pointer"
                  :style="`left: ${sliderMaxPercent}%`"
                  @mousedown="startDrag('max', $event)"
                  @touchstart.prevent="startDrag('max', $event)"
                ></div>
              </div>
            </div>

            <div class="mb-6 pb-6 border-b">
              <p class="text-gray-100 mb-4 text-base">Broj zvjezdica</p>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-primary-80 rounded border-gray-40 mr-2"
                    :checked="selectedStars.includes(5)"
                    @change="toggleStarRating(5)"
                  />
                  <div class="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span
                    ><span>★</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-primary-80 rounded border-gray-40 mr-2"
                    :checked="selectedStars.includes(4)"
                    @change="toggleStarRating(4)"
                  />
                  <div class="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span
                    ><span class="text-gray-200">★</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-primary-80 rounded border-gray-40 mr-2"
                    :checked="selectedStars.includes(3)"
                    @change="toggleStarRating(3)"
                  />
                  <div class="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span
                    ><span class="text-gray-200">★</span
                    ><span class="text-gray-200">★</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-blue-500 rounded border-gray-40 mr-2"
                    :checked="selectedStars.includes(2)"
                    @change="toggleStarRating(2)"
                  />
                  <div class="flex text-yellow-400">
                    <span>★</span><span>★</span
                    ><span class="text-gray-200">★</span
                    ><span class="text-gray-200">★</span
                    ><span class="text-gray-200">★</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-blue-500 rounded border-gray-300 mr-2"
                    :checked="selectedStars.includes(1)"
                    @change="toggleStarRating(1)"
                  />
                  <div class="flex text-yellow-400">
                    <span>★</span><span class="text-gray-200">★</span
                    ><span class="text-gray-200">★</span
                    ><span class="text-gray-200">★</span
                    ><span class="text-gray-200">★</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-6">
              <p class="text-gray-700 text-base mb-4">Popularni filteri</p>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-blue-500 rounded border-gray-40 mr-2"
                    :checked="
                      selectedAmenities.includes(getAmenityIdByName('Bazen'))
                    "
                    @change="toggleAmenity('Bazen')"
                  />
                  <span class="text-gray-80 text-sm">Bazen</span>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-blue-500 rounded border-gray-40 mr-2"
                    :checked="
                      selectedAmenities.includes(getAmenityIdByName('WiFi'))
                    "
                    @change="toggleAmenity('WiFi')"
                  />
                  <span class="text-gray-80 text-sm">WiFi</span>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-18px w-18px text-blue-500 rounded border-gray-40 mr-2"
                    :checked="
                      selectedAmenities.includes(getAmenityIdByName('Klima'))
                    "
                    @change="toggleAmenity('Klima')"
                  />
                  <span class="text-gray-80 text-sm">Klima</span>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-500 rounded border-gray-40 mr-2"
                    :checked="
                      selectedAmenities.includes(getAmenityIdByName('Parking'))
                    "
                    @change="toggleAmenity('Parking')"
                  />
                  <span class="text-gray-80 text-sm">Parking</span>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-500 rounded border-gray-40 mr-2"
                    :checked="isApartmanTypeSelected"
                    @change="toggleApartmanType"
                  />
                  <span class="text-gray-80 text-sm">Apartman</span>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-500 rounded border-gray-40 mr-2"
                    :checked="
                      selectedAmenities.includes(getAmenityIdByName('TV'))
                    "
                    @change="toggleAmenity('TV')"
                  />
                  <span class="text-gray-80 text-sm">TV</span>
                </div>
              </div>
            </div>

            <div class="pb-6">
              <button
                @click="applyFilters"
                class="w-full py-4 bg-white border border-primary-80 text-primary-80 rounded font-medium hover:bg-primary-60 transition-colors"
              >
                Primjeni filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 pb-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-[25px] font-bold text-gray-100 px-2 lg:px-0">
            {{ filteredSmjestaji.length }} smještaja pronađeno
          </h1>

          <div class="relative hidden lg:block">
            <button
              @click="toggleSortDropdown"
              class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span class="text-gray-80 text-base">Sortiraj po:</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                :class="{ 'transform rotate-180': showSortDropdown }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#BEC0C5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              v-if="showSortDropdown"
              class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            >
              <div class="py-1">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="setSortOption(option.value)"
                  class="w-full px-4 py-2 text-left hover:text-white hover:bg-primary-100 transition-colors"
                  :class="{
                    'font-medium text-blue-600': sortBy === option.value,
                  }"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <SmjestajGrid
          :smjestaji="filteredSmjestaji"
          :is-loading="isLoading"
          :error="error"
          :get-thumbnail-url="getThumbnailUrl"
          :format-price="formatPrice"
          :format-price-h-r-k="formatPriceHRK"
          :get-sadrzaj-icon-url="getSadrzajIconUrl"
          :items-per-page="3"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { SmjestajWithRelations } from "~/types/directus/index";

export default defineComponent({
  setup() {
    const route = useRoute();

    const allSmjestaji = ref<SmjestajWithRelations[]>([]);
    const filteredSmjestaji = ref<SmjestajWithRelations[]>([]);

    const {
      tipovi,
      isLoading: tipoviLoading,
      error: tipoviError,
      fetchTipovi,
    } = useTipoviSmjestaja();

    const {
      regije,
      isLoading: regijeLoading,
      error: regijeError,
      fetchRegije,
    } = useRegije();

    const {
      completeSmjestaji,
      fetchCompleteSmjestaji,
      sadrzaji,
      isLoading,
      error,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,
      hasAmenity,
      fetchSadrzaji,
    } = useSmjestaji();

    const { onSearch, urlParams } = useFilter();

    const {
      showSortDropdown,
      sortBy,
      sortOptions,
      showSortModal,
      toggleSortDropdown,
      setSortOption,
      applySort,
      openSortModal,
    } = useSorting(filteredSmjestaji);

    const {
      touchStartY,
      touchMoveY,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    } = useTouch(showSortModal);

    const {
      priceMin,
      priceMax,
      currentPriceMin,
      currentPriceMax,
      sliderMinPercent,
      sliderMaxPercent,
      sliderWidth,
      updatePriceRange,
      startDrag,
      handleDrag,
      stopDrag,
    } = usePriceRange(allSmjestaji);

    const {
      isFilterVisible,
      selectedRegion,
      selectedType,
      selectedPriceRange,
      checkinDate,
      checkoutDate,
      adults,
      children,
      selectedStars,
      selectedAmenities,
      isApartmanTypeSelected,
      closeFilter,
      showFilter,
      resetFilters,
      toggleStarRating,
      toggleAmenity,
      toggleApartmanType,
      getAmenityIdByName,
      applyFilters,
    } = useAdvancedFilters(
      allSmjestaji,
      filteredSmjestaji,
      tipovi,
      sadrzaji,
      currentPriceMin,
      currentPriceMax,
      sortBy,
      applySort,
      hasAmenity,
      updatePriceRange
    );

    onMounted(async () => {
      try {
        document.addEventListener("click", (event) => {
          const target = event.target as HTMLElement;
          if (showSortDropdown.value && !target.closest(".relative")) {
            showSortDropdown.value = false;
          }
        });

        await fetchSadrzaji();
        await fetchTipovi();
        await fetchRegije();

        await fetchCompleteSmjestaji();
        console.log(
          "Complete data from fetchCompleteSmjestaji:",
          completeSmjestaji.value
        );

        allSmjestaji.value = [...completeSmjestaji.value];
        updatePriceRange();

        applyFilters();
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    });

    watch(completeSmjestaji, (newSmjestaji: SmjestajWithRelations[]) => {
      allSmjestaji.value = [...newSmjestaji];
      applyFilters();
    });

    watch(
      () => route.query,
      () => {
        applyFilters();
      },
      { deep: true, immediate: true }
    );

    watch(
      tipovi,
      () => {
        if (allSmjestaji.value.length > 0) {
          applyFilters();
        }
      },
      { deep: true }
    );

    return {
      // Basic data
      tipovi,
      tipoviLoading,
      tipoviError,
      regije,
      regijeLoading,
      regijeError,
      smjestaji: allSmjestaji,
      filteredSmjestaji,
      isLoading,
      error,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,
      isFilterVisible,

      // Basic filters
      selectedRegion,
      selectedType,
      selectedPriceRange,
      checkinDate,
      checkoutDate,
      adults,
      children,

      // Advanced filters
      priceMin,
      priceMax,
      currentPriceMin,
      currentPriceMax,
      sliderMinPercent,
      sliderMaxPercent,
      sliderWidth,
      selectedStars,
      selectedAmenities,
      isApartmanTypeSelected,
      showSortDropdown,
      sortBy,
      sortOptions,
      toggleSortDropdown,
      setSortOption,
      applySort,
      closeFilter,
      showFilter,

      // Methods
      onSearch,
      resetFilters,
      toggleStarRating,
      toggleAmenity,
      toggleApartmanType,
      getAmenityIdByName,
      applyFilters,
      startDrag,
      handleDrag,
      stopDrag,
      updatePriceRange,
      urlParams,

      openSortModal,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      showSortModal,
    };
  },
});
</script>
