<template>
  <div class="mt-10 md:mt-14 py-6">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-10 text-red-500">
      {{ error }}
    </div>

    <!-- Content when loaded -->
    <div v-else-if="currentNovost" class="max-w-1200 mx-auto px-4">
      <!-- Article header with image section -->
      <div class="mb-10">
        <!-- Title -->

        <!-- Short description and image side by side -->
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex flex-col md:w-1/2">
            <div class="flex items-center text-primary-80 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <NuxtLink to="/novosti-index" class="text-sm font-medium">
                Nazad na Novosti
              </NuxtLink>
            </div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              {{ currentNovost.naslov }}
            </h1>

            <!-- Category and date on same row -->
            <div
              class="flex items-center text-sm text-gray-500 uppercase tracking-wider mb-6"
            >
              <span v-if="currentNovost.kategorija_novosti" class="mr-4">
                {{ currentNovost.kategorija_novosti.naziv }}
              </span>
              <span>{{ formatDate(currentNovost.date_created) }}</span>
            </div>
            <p class="text-gray-700">{{ currentNovost.kratki_opis }}</p>
          </div>

          <div class="md:w-1/2">
            <img
              v-if="getHeroImageUrl(currentNovost)"
              :src="getHeroImageUrl(currentNovost) || ''"
              :alt="currentNovost.naslov"
              class="w-full rounded-lg object-cover max-w-[586]"
            />
            <div
              v-else
              class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"
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
        </div>
      </div>

      <!-- Main content with max-width: 800px -->
      <div class="max-w-[800px] mx-auto">
        <!-- Content sections -->
        <div class="prose max-w-none text-gray-700">
          <div v-html="currentNovost.sadrzaj"></div>
        </div>
      </div>
    </div>

    <!-- Related news section -->
    <div class="bg-primary-5 py-8">
      <div class="bg-primary-5">
        <div
          v-if="relatedNovosti.length > 0"
          class="mt-16 pt-8 max-w-[1284px] mx-auto md:px-4"
        >
          <h2 class="text-[32px] font-bold mb-6 max-w-1200 mx-auto px-4">
            Više iz kategorije
          </h2>

          <div class="carousel-wrapper relative">
            <button
              @click="prevSlide"
              class="nav-arrow nav-prev"
              v-show="showDesktopControls"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <ClientOnly>
              <swiper-container
                ref="swiperRef"
                :slides-per-view="1"
                :space-between="24"
                :pagination="false"
                :navigation="false"
                :breakpoints="{
                  '640': {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  '768': {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }"
                class="related-carousel px-0"
              >
                <swiper-slide
                  v-for="novost in relatedNovosti.slice(0, 4)"
                  :key="novost.id"
                  class="pb-10 max-w-[80%] md:max-w-full"
                >
                  <div class="h-full">
                    <NovostCard
                      :novost="novost"
                      :get-hero-image-url="getHeroImageUrl"
                      :format-date="formatDate"
                    />
                  </div>
                </swiper-slide>
              </swiper-container>

              <div class="fixed-pagination flex justify-center mt-4 space-x-2">
                <button
                  v-for="i in Math.ceil(Math.min(relatedNovosti.length, 4) / 2)"
                  :key="i - 1"
                  class="pagination-dot"
                  :class="{ active: activeDot === i - 1 }"
                  @click="goToGroup(i - 1)"
                  type="button"
                ></button>
              </div>
            </ClientOnly>

            <button
              @click="nextSlide"
              class="nav-arrow nav-next"
              v-show="showDesktopControls"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Novost } from "~/types/directus/index";
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

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default defineComponent({
  setup() {
    const route = useRoute();
    const slug = computed(() => route.params.slug as string);

    // Use the novosti composable
    const {
      currentNovost,
      novosti,
      isLoading,
      error,
      fetchNovostBySlug,
      fetchNovostiByKategorija,
      getHeroImageUrl,
      formatDate,
    } = useNovosti();

    // Fetch the novost by slug when component mounts or slug changes
    watch(
      slug,
      async (newSlug: string) => {
        if (newSlug) {
          await fetchNovostBySlug(newSlug);
        }
      },
      { immediate: true }
    );

    // Fetch related novosti when current novost changes
    const relatedNovosti = ref<Novost[]>([]);

    watch(
      currentNovost,
      async () => {
        if (currentNovost.value && currentNovost.value.kategorija_novosti_id) {
          await fetchNovostiByKategorija(
            currentNovost.value.kategorija_novosti_id
          );
          // Filter out the current novost and limit to 4 items
          relatedNovosti.value = novosti.value
            .filter(
              (item: { id: number }) => item.id !== currentNovost.value?.id
            )
            .slice(0, 4);
        }
      },
      { immediate: true }
    );

    // Set page title and meta
    watch(currentNovost, () => {
      if (currentNovost.value) {
        useHead({
          title: `${currentNovost.value.naslov} | Otkrij Hrvatsku`,
          meta: [
            {
              name: "description",
              content:
                currentNovost.value.kratki_opis ||
                "Pročitajte najnovije vijesti o Hrvatskoj.",
            },
          ],
        });
      }
    });
    const swiperRef = ref(null);
    const activeDot = ref(0);
    const windowWidth = ref(
      typeof window !== "undefined" ? window.innerWidth : 1024
    );

    const showDesktopControls = computed(() => {
      return windowWidth.value >= 768;
    });

    const getSwiperInstance = (): SwiperInstance | null => {
      if (!swiperRef.value) return null;
      return (swiperRef.value as any)?.swiper || null;
    };

    const updateActiveDot = () => {
      const swiper = getSwiperInstance();
      if (!swiper) return;

      const totalGroups = Math.ceil(Math.min(4, swiper.slides.length) / 2);
      const totalSlides = swiper.slides.length;
      const slidesPerGroup = Math.ceil(totalSlides / totalGroups);

      const currentIndex = swiper.activeIndex;
      activeDot.value = Math.min(
        Math.floor(currentIndex / slidesPerGroup),
        totalGroups - 1
      );
    };

    onMounted(() => {
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

    const goToGroup = (groupIndex: number): void => {
      const swiper = getSwiperInstance();
      if (!swiper) return;

      const totalGroups = Math.ceil(Math.min(4, swiper.slides.length) / 2);
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
      slug,
      currentNovost,
      isLoading,
      error,
      relatedNovosti,
      getHeroImageUrl,
      formatDate,
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
/* Tailwind prose styles for rich text content */
.prose {
  font-size: 1.125rem;
  line-height: 1.75;
}

.prose > *:first-child {
  margin-top: 0;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose img {
  border-radius: 0.375rem;
  margin-top: 2em;
  margin-bottom: 2em;
}

.prose h2 {
  font-weight: 700;
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3333333;
}

.prose h3 {
  font-weight: 600;
  font-size: 1.25em;
  margin-top: 1.6em;
  margin-bottom: 0.6em;
  line-height: 1.6;
}

.prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

.prose a:hover {
  color: #1d4ed8;
}

.prose blockquote {
  font-style: italic;
  border-left-width: 4px;
  border-left-color: #e5e7eb;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
}
</style>
