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
    <!-- mOBILE -->
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

      <!-- Sort Button -->
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
        <!-- Mobile full-screen overlay for screens below 1024px -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          @click="closeFilter"
        ></div>

        <!-- Filter container - full screen on mobile, normal on desktop -->
        <div
          class="fixed inset-0 z-50 lg:static lg:z-auto overflow-y-auto bg-white lg:rounded-lg lg:border lg:border-gray-5 lg:p-4 lg:max-w-[384px] lg:h-fit w-full"
        >
          <!-- Header with close button for mobile -->
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

          <!-- Filter content with padding on mobile -->
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

            <!-- Apply button with bottom padding on mobile -->
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
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useRegije } from "~/composables/useRegije";
import { useSmjestaji } from "~/composables/useSmjestaji";
import type { SmjestajWithRelations } from "~/types/directus/index";
import { useFilter } from "~/composables/filters/useFilters";

export default defineComponent({
  setup() {
    const route = useRoute();

    const showSortDropdown = ref(false);
    const sortBy = ref<string>("default");
    const isFilterVisible = ref(false);
    const showSortModal = ref(false);
    const touchStartY = ref(0);
    const touchMoveY = ref(0);

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.value = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      touchMoveY.value = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const slideDistance = touchMoveY.value - touchStartY.value;

      // If the user slides down more than 50px, close the modal
      if (slideDistance > 50) {
        showSortModal.value = false;
      }

      // Reset values
      touchStartY.value = 0;
      touchMoveY.value = 0;
    };

    const openSortModal = () => {
      showSortModal.value = true;
    };

    const sortOptions = [
      { label: "Cijena: niža prema višoj", value: "price-asc" },
      { label: "Cijena: viša prema nižoj", value: "price-desc" },
      { label: "Zvijezdice: niže prema višem", value: "stars-asc" },
      { label: "Zvijezdice: više prema nižem", value: "stars-desc" },
    ];

    const closeFilter = () => {
      isFilterVisible.value = false;
    };
    const showFilter = () => {
      isFilterVisible.value = true;
    };

    const toggleSortDropdown = () => {
      showSortDropdown.value = !showSortDropdown.value;
    };

    const setSortOption = (option: string) => {
      sortBy.value = option;
      showSortDropdown.value = false;
      applySort();
    };

    const applySort = () => {
      const sortedResults = [...filteredSmjestaji.value];

      switch (sortBy.value) {
        case "price-asc":
          sortedResults.sort(
            (a, b) => (a.cijena_nocenja || 0) - (b.cijena_nocenja || 0)
          );
          break;
        case "price-desc":
          sortedResults.sort(
            (a, b) => (b.cijena_nocenja || 0) - (a.cijena_nocenja || 0)
          );
          break;
        case "stars-asc":
          sortedResults.sort(
            (a, b) => (a.broj_zvjezdica || 0) - (b.broj_zvjezdica || 0)
          );
          break;
        case "stars-desc":
          sortedResults.sort(
            (a, b) => (b.broj_zvjezdica || 0) - (a.broj_zvjezdica || 0)
          );
          break;
        default:
          break;
      }

      filteredSmjestaji.value = sortedResults;
    };

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

    // Filter states
    const selectedRegion = ref<number | null>(null);
    const selectedType = ref<number | null>(null);
    const selectedPriceRange = ref<string | null>(null);
    const checkinDate = ref<Date | null>(null);
    const checkoutDate = ref<Date | null>(null);
    const adults = ref<number>(2);
    const children = ref<number>(0);

    const priceMin = ref(0);
    const priceMax = computed(() => {
      if (allSmjestaji.value.length === 0) return 240;

      return Math.ceil(
        Math.max(
          ...allSmjestaji.value.map(
            (item: { cijena_nocenja: number }) => item.cijena_nocenja || 0
          )
        )
      );
    });
    const currentPriceMin = ref(0);
    const currentPriceMax = ref(0);

    const updatePriceRange = () => {
      currentPriceMax.value = priceMax.value;
    };

    const selectedStars = ref<number[]>([]);
    const selectedAmenities = ref<number[]>([]);

    const dragType = ref<"min" | "max" | null>(null);

    const sliderMinPercent = computed(
      () => (currentPriceMin.value / priceMax.value) * 100
    );
    const sliderMaxPercent = computed(
      () => (currentPriceMax.value / priceMax.value) * 100
    );
    const sliderWidth = computed(
      () => sliderMaxPercent.value - sliderMinPercent.value
    );

    const isApartmanTypeSelected = computed(() => {
      const apartmanType = tipovi.value.find(
        (t: { naziv: string }) => t.naziv === "Apartman"
      );
      return apartmanType && selectedType.value === apartmanType.id;
    });

    // Main data arrays
    const allSmjestaji = ref<SmjestajWithRelations[]>([]);
    const filteredSmjestaji = ref<SmjestajWithRelations[]>([]);

    // Reset all filters
    const resetFilters = () => {
      selectedRegion.value = null;
      selectedType.value = null;
      currentPriceMin.value = 0;

      selectedStars.value = [];
      selectedAmenities.value = [];
      checkinDate.value = null;
      checkoutDate.value = null;
      adults.value = 2;
      children.value = 0;
      updatePriceRange();

      navigateTo({
        path: "/smjestaji",
        query: {},
      });

      // Reset filteredSmjestaji to show all
      filteredSmjestaji.value = [...allSmjestaji.value];
    };

    // Toggle star rating filter
    const toggleStarRating = (stars: number) => {
      const index = selectedStars.value.indexOf(stars);
      if (index === -1) {
        selectedStars.value.push(stars);
      } else {
        selectedStars.value.splice(index, 1);
      }
    };

    // Get amenity ID by name
    const getAmenityIdByName = (name: string): number => {
      const amenity = sadrzaji.value.find(
        (s: { naziv: string }) => s.naziv.toLowerCase() === name.toLowerCase()
      );
      return amenity ? amenity.id : -1;
    };

    // Toggle amenity filter
    const toggleAmenity = (name: string) => {
      const amenityId = getAmenityIdByName(name);
      if (amenityId === -1) return;

      const index = selectedAmenities.value.indexOf(amenityId);
      if (index === -1) {
        selectedAmenities.value.push(amenityId);
      } else {
        selectedAmenities.value.splice(index, 1);
      }
    };

    // Toggle Apartman type
    const toggleApartmanType = () => {
      const apartmanType = tipovi.value.find(
        (t: { naziv: string }) => t.naziv === "Apartman"
      );
      if (!apartmanType) return;

      if (selectedType.value === apartmanType.id) {
        selectedType.value = null;
      } else {
        selectedType.value = apartmanType.id;
      }
    };

    // Start dragging slider handle
    const startDrag = (type: "min" | "max", event: MouseEvent | TouchEvent) => {
      dragType.value = type;

      // Mouse events
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);

      // Touch events
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", stopDrag);
      document.addEventListener("touchcancel", stopDrag);

      // Prevent default to avoid page scrolling during touch drag
      event.preventDefault();
    };

    // Handle drag movement
    const handleDrag = (event: MouseEvent | TouchEvent) => {
      if (!dragType.value) return;

      // Get the clientX value from either mouse or touch event
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;

      const slider = (
        "touches" in event ? event.target : event.target
      ) as HTMLElement;
      const sliderRect = slider.parentElement?.getBoundingClientRect();
      if (!sliderRect) return;

      const offsetX = clientX - sliderRect.left;
      const percent = Math.min(Math.max(0, offsetX / sliderRect.width), 1);
      const newValue = Math.round(percent * priceMax.value);

      if (dragType.value === "min") {
        currentPriceMin.value = Math.min(newValue, currentPriceMax.value - 10);
      } else {
        currentPriceMax.value = Math.max(newValue, currentPriceMin.value + 10);
      }
    };

    // Stop dragging
    const stopDrag = () => {
      dragType.value = null;

      // Remove mouse events
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);

      // Remove touch events
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", stopDrag);
      document.removeEventListener("touchcancel", stopDrag);
    };

    const applyFilters = () => {
      let results = [...allSmjestaji.value];

      // First apply URL filters
      const route = useRoute();
      if (route.query.location) {
        results = results.filter(
          (item) => item.regija && item.regija.slug === route.query.location
        );
      }

      if (route.query.type) {
        results = results.filter(
          (item) =>
            item.tip_smjestaja && item.tip_smjestaja.slug === route.query.type
        );
      }

      if (route.query.adults || route.query.children) {
        const adults = route.query.adults
          ? parseInt(route.query.adults as string)
          : 0;
        const children = route.query.children
          ? parseInt(route.query.children as string)
          : 0;
        const totalGuests = adults + children;

        results = results.filter((item) => {
          const maxGuests = item.max_broj_gostiju || 0;
          return maxGuests >= totalGuests;
        });
      }

      // Filter by date availability
      if (route.query.checkin && route.query.checkout) {
        // Parse the checkin/checkout dates from URL
        const checkinStr = route.query.checkin as string;
        const checkoutStr = route.query.checkout as string;

        // Convert from "DD.MM.YYYY." format to Date objects
        const parseDate = (dateStr: string) => {
          const parts = dateStr.split(".");
          if (parts.length >= 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
          }
          return null;
        };

        const checkinDate = parseDate(checkinStr);
        const checkoutDate = parseDate(checkoutStr);

        if (checkinDate && checkoutDate) {
          // Set time to beginning of day for consistent comparison
          checkinDate.setHours(0, 0, 0, 0);
          checkoutDate.setHours(0, 0, 0, 0);

          results = results.filter((item) => {
            // If the accommodation has no reservations, it's available
            if (!item.rezervacije || item.rezervacije.length === 0) {
              return true;
            }

            // Check each reservation for overlap
            for (const reservation of item.rezervacije) {
              const reservationStart = new Date(reservation.datum_od);
              const reservationEnd = new Date(reservation.datum_do);

              // Set time to beginning of day for consistent comparison
              reservationStart.setHours(0, 0, 0, 0);
              reservationEnd.setHours(0, 0, 0, 0);

              // The guest arrives on checkinDate and leaves on checkoutDate,
              // so they occupy the accommodation from checkinDate to the day before checkoutDate.
              // Similarly, an existing reservation occupies from reservationStart to the day before reservationEnd.

              // Create a date for the day before checkout (the last night of stay)
              const lastNight = new Date(checkoutDate);
              lastNight.setDate(lastNight.getDate() - 1);

              // Create a date for the day before reservation end
              const reservationLastNight = new Date(reservationEnd);
              reservationLastNight.setDate(reservationLastNight.getDate() - 1);

              // Check for overlap:
              // If the requested checkin day is on or before the reservation's last night AND
              // the requested last night is on or after the reservation's start day,
              // then there's an overlap
              if (
                checkinDate <= reservationLastNight &&
                lastNight >= reservationStart
              ) {
                return false;
              }
            }

            // If no overlap with any reservation, the accommodation is available
            return true;
          });
        }
      }

      // Apply star rating filter
      if (selectedStars.value.length > 0) {
        results = results.filter((item) => {
          // Convert to number to ensure consistent comparison
          const stars = Number(item.broj_zvjezdica || 0);
          return selectedStars.value.includes(stars);
        });
      }

      if (selectedAmenities.value.length > 0) {
        results = results.filter((item) => {
          for (const amenityId of selectedAmenities.value) {
            if (!hasAmenity(item, amenityId)) {
              return false;
            }
          }
          return true;
        });
      }

      if (selectedType.value !== null) {
        results = results.filter(
          (item) => item.tipovi_smjestaja_id === selectedType.value
        );
      }

      results = results.filter((item) => {
        const price = item.cijena_nocenja;
        return price >= currentPriceMin.value && price <= currentPriceMax.value;
      });

      filteredSmjestaji.value = results;

      if (sortBy.value !== "default") {
        applySort();
      }
    };

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
