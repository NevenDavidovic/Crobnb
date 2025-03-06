<template>
  <div class="novosti-section">
    <div v-if="isLoading" class="flex justify-center">
      <div class="text-gray-500">Loading news...</div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
      {{ error }}
    </div>

    <div v-else-if="novosti.length === 0" class="text-center py-8">
      <p class="text-gray-100">No news articles found.</p>
    </div>

    <div v-else class="carousel-wrapper relative">
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
          :space-between="20"
          :pagination="false"
          :navigation="false"
          :breakpoints="{
            '640': {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            '768': {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            '1024': {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }"
          class="novosti-carousel px-0"
        >
          <swiper-slide
            v-for="novost in novosti"
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
            v-for="i in 3"
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

export default defineComponent({
  props: {
    novosti: {
      type: Array as PropType<Novost[]>,
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
    getHeroImageUrl: {
      type: Function as PropType<(novost: Novost) => string | null>,
      required: true,
    },
    formatDate: {
      type: Function as PropType<(dateString: string) => string>,
      required: true,
    },
  },

  setup() {
    const swiperRef = ref(null);
    const activeDot = ref(0);
    const windowWidth = ref(
      typeof window !== "undefined" ? window.innerWidth : 1024
    );

    const showDesktopControls = computed(() => {
      return windowWidth.value >= 1024;
    });

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
.novosti-section {
  margin-bottom: 2rem;
}

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
  color: #337589;
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

.novosti-carousel {
  padding-bottom: 10px;
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
  background-color: #337589;
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
