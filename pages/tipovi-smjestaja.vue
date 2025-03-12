<template>
  <div class="max-w-1200 mx-auto px-4 py-8 mt-14">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-[40px] font-bold mb-2">Tipovi smještaja</h1>
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else>
      <!-- For each accommodation type -->
      <div v-for="(tip, index) in tipovi" :key="tip.id" class="mb-16">
        <!-- Alternating layout based on even/odd index -->
        <div
          class="flex flex-col md:flex-row items-stretch h-full mb-4 gap-6"
          :class="[index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse']"
        >
          <!-- Description Box -->
          <div
            class="bg-primary-5 p-6 md:p-10 rounded-lg flex flex-col w-full md:w-2/5 max-h-[380px]"
          >
            <div class="flex items-center mb-4">
              <h2 class="text-[32px] font-bold">{{ tip.naziv }}</h2>
            </div>

            <p v-if="tip.kratki_opis" class="text-gray-80 text-base mb-6">
              {{ tip.kratki_opis }}
            </p>

            <NuxtLink
              :to="`/smjestaji?location=sve&type=${tip.slug}`"
              class="text-primary-80 hover:underline flex items-center"
            >
              Istraži tip smještaja {{ tip.naziv.toLowerCase() }}
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

          <!-- Accommodations Box -->
          <div class="w-full md:w-3/5 flex flex-col">
            <template
              v-if="!tipSmjestaji[tip.id] || tipSmjestaji[tip.id].length === 0"
            >
              <div
                class="text-gray-500 h-full flex items-center justify-center"
              >
                Trenutno nema dostupnih smještaja u ovoj kategoriji.
              </div>
            </template>

            <template v-else>
              <!-- Desktop: Normal Flex Row -->
              <div class="hidden md:flex flex-row gap-4 h-full">
                <SmjestajDetailCard
                  v-for="smjestaj in tipSmjestaji[tip.id]"
                  :key="smjestaj.id"
                  :item="{
                    imageUrl:
                      getThumbnailUrl(smjestaj) || '/placeholder-apartment.jpg',
                    name: smjestaj.naziv,
                    type: smjestaj.grad || 'PROVJERI SMJEŠTAJ',
                    rating: smjestaj.broj_zvjezdica || 5,
                    price: smjestaj.cijena_nocenja,
                  }"
                  @click="goToDetail(smjestaj)"
                />
              </div>

              <!-- Mobile: Swiper -->
              <div class="md:hidden relative carousel-wrapper">
                <ClientOnly>
                  <swiper-container
                    ref="swiperRef"
                    :slides-per-view="1"
                    :space-between="20"
                    :pagination="false"
                    :navigation="false"
                    class="w-full px-0"
                  >
                    <swiper-slide
                      v-for="smjestaj in tipSmjestaji[tip.id]"
                      :key="smjestaj.id"
                      class="pb-10 max-w-[80%] md:max-w-full"
                    >
                      <div class="h-full">
                        <SmjestajDetailCard
                          :item="{
                            imageUrl:
                              getThumbnailUrl(smjestaj) ||
                              '/placeholder-apartment.jpg',
                            name: smjestaj.naziv,
                            type: smjestaj.grad || 'PROVJERI SMJEŠTAJ',
                            rating: smjestaj.broj_zvjezdica || 5,
                            price: smjestaj.cijena_nocenja,
                          }"
                          @click="goToDetail(smjestaj)"
                        />
                      </div>
                    </swiper-slide>
                  </swiper-container>

                  <div
                    class="fixed-pagination flex justify-center mt-4 space-x-2"
                  >
                    <button
                      v-for="i in 3"
                      :key="i - 1"
                      class="pagination-dot"
                      :class="{ active: activeDot === i - 1 }"
                      @click="goToGroup(i - 1)"
                      type="button"
                    ></button>
                  </div>
                </ClientOnly>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useTipoviSmjestaja } from "~/composables/useTipoviSmjestaja";
import { useSmjestaji } from "~/composables/useSmjestaji";
import type { TipSmjestaja, Smjestaj } from "~/types/directus/index";

interface SwiperInstance {
  slides: {
    length: number;
    [key: string]: any;
  };
  activeIndex: number;
  slideTo: (index: number, speed?: number, runCallbacks?: boolean) => void;
  slideNext: (speed?: number, runCallbacks?: boolean) => void;
  slidePrev: (speed?: number, runCallbacks?: boolean) => void;
  [key: string]: any;
}

export default defineComponent({
  setup() {
    const router = useRouter();
    const ITEMS_PER_TYPE = 3;
    const swiperRef = ref(null);
    const activeDot = ref(0);
    const windowWidth = ref(
      typeof window !== "undefined" ? window.innerWidth : 1024
    );

    // Use the tipovi_smjestaja composable
    const {
      tipovi,
      isLoading: isTipoviLoading,
      error: tipoviError,
      fetchTipovi,
      getIconUrl,
    } = useTipoviSmjestaja();

    // Use the smjestaji composable
    const {
      smjestaji: allSmjestaji,
      isLoading: isSmjestajiLoading,
      error: smjestajiError,
      fetchSmjestajiByTip,
      getThumbnailUrl,
    } = useSmjestaji();

    // Store smjestaji grouped by type
    const tipSmjestaji = ref<Record<number, Smjestaj[]>>({});

    // Helper to get swiper instance
    const getSwiperInstance = (): SwiperInstance | null => {
      if (!swiperRef.value) return null;
      return (swiperRef.value as any)?.swiper || null;
    };

    const updateActiveDot = () => {
      const swiper = getSwiperInstance();
      if (!swiper) return;

      const totalGroups = 3;
      const totalSlides = swiper.slides.length;
      const slidesPerGroup = Math.ceil(totalSlides / totalGroups);

      const currentIndex = swiper.activeIndex;
      activeDot.value = Math.min(Math.floor(currentIndex / slidesPerGroup), 2);
    };

    // Computed properties
    const isLoading = computed(
      () => isTipoviLoading.value || isSmjestajiLoading.value
    );

    const error = computed(() => tipoviError.value || smjestajiError.value);

    const showDesktopControls = computed(() => {
      return windowWidth.value >= 1024;
    });

    // Swiper navigation methods
    const goToGroup = (groupIndex: number): void => {
      const swiper = getSwiperInstance();
      if (!swiper) return;

      const totalGroups = 3;
      const totalSlides = swiper.slides.length;
      const slidesPerGroup = Math.ceil(totalSlides / totalGroups);

      const slideIndex = groupIndex * slidesPerGroup;
      swiper.slideTo(Math.min(slideIndex, totalSlides - 1));

      activeDot.value = groupIndex;
    };

    const nextSlide = (): void => {
      const swiper = getSwiperInstance();
      if (swiper) {
        swiper.slideNext();
        updateActiveDot();
      }
    };

    const prevSlide = (): void => {
      const swiper = getSwiperInstance();
      if (swiper) {
        swiper.slidePrev();
        updateActiveDot();
      }
    };

    // Fetch all accommodation types
    const fetchData = async () => {
      await fetchTipovi();

      // For each type, fetch accommodations
      if (tipovi.value && tipovi.value.length > 0) {
        for (const tip of tipovi.value) {
          console.log(tip);
          await fetchSmjestajiByTypeLimit(tip.id, ITEMS_PER_TYPE);
        }
      }
    };

    // Fetch limited number of accommodations by type
    const fetchSmjestajiByTypeLimit = async (tipId: number, limit: number) => {
      try {
        // Use the existing method in your composable
        await fetchSmjestajiByTip(tipId, limit);

        // Store results in our grouped object
        if (allSmjestaji.value && allSmjestaji.value.length > 0) {
          tipSmjestaji.value[tipId] = allSmjestaji.value.slice(0, limit);
        } else {
          tipSmjestaji.value[tipId] = [];
        }
      } catch (err) {
        console.error(`Error fetching accommodations for type ${tipId}:`, err);
        tipSmjestaji.value[tipId] = [];
      }
    };

    // Navigation methods
    const goToDetail = (smjestaj: Smjestaj) => {
      router.push(`/smjestaj/${smjestaj.slug || smjestaj.id}`);
    };

    const viewMoreByType = (tip: TipSmjestaja) => {
      router.push(`/tipovi-smjestaja/${tip.slug || tip.id}`);
    };

    // Event handling
    onMounted(() => {
      fetchData();

      nextTick(() => {
        if (!swiperRef.value) return;

        const swiperEl = swiperRef.value as any;
        if (!swiperEl) return;

        if (swiperEl.initialize) {
          swiperEl.initialize();
        }

        swiperEl.addEventListener("slidechange", () => {
          updateActiveDot();
        });

        updateActiveDot();
      });
    });

    watch(
      () => {
        const swiper = getSwiperInstance();
        return swiper?.activeIndex;
      },
      () => {
        updateActiveDot();
      }
    );

    onUnmounted(() => {
      if (swiperRef.value) {
        const swiperEl = swiperRef.value as any;
        if (swiperEl.removeEventListener) {
          swiperEl.removeEventListener("slidechange", updateActiveDot);
        }
      }
    });

    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        windowWidth.value = window.innerWidth;
      });
    }

    return {
      tipovi,
      tipSmjestaji,
      isLoading,
      error,
      getThumbnailUrl,
      getIconUrl,
      goToDetail,
      viewMoreByType,
      swiperRef,
      activeDot,
      showDesktopControls,
      goToGroup,
      nextSlide,
      prevSlide,
    };
  },
});
</script>

<style>
.carousel-wrapper {
  position: relative;
  padding: 0 40px;
}

.nav-arrow {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--primary-80, #3b82f6);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-arrow:hover {
  background-color: #f8fafc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-prev {
  left: 0;
}

.nav-next {
  right: 0;
}

.fixed-pagination {
  margin-top: 15px;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #cccccc;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-dot.active {
  background-color: var(--primary-80, #3b82f6);
}

@media (max-width: 639px) {
  .fixed-pagination {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .carousel-wrapper {
    padding: 0;
  }
}
</style>
