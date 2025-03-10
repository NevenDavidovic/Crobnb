import { useSmjestaji } from "~/composables/useSmjestaji";
import type { Sadrzaj, Smjestaj } from "~/types/directus/index";

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

export function useAccommodationDetail() {
  const route = useRoute();
  const router = useRouter();

  // Get the slug parameter from the URL
  const slug = computed(() => route.params.slug as string);
  const isFavorite = ref(false);

  const {
    currentSmjestaj,
    currentCompleteSmjestaj,
    isLoading,
    error,
    fetchCompleteSmjestajBySlug,
    fetchSmjestajiByCity,
    formatPrice,
    formatPriceHRK,
    getSadrzajIconUrl,
    getSlikaUrl,
    formatTime,
    getThumbnailUrl,
  } = useSmjestaji();

  const citySmjestaji = ref<Smjestaj[]>([]);
  const loadingCitySmjestaji = ref(false);
  const citySmjestajiError = ref<string | null>(null);

  const selectedDates = ref({
    checkin: new Date(),
    checkout: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Default 3 days
  });

  const navigateToSmjestaji = () => {
    router.push("/smjestaji");
  };

  // Swiper related refs
  const swiperRef = ref(null);
  const activeDot = ref(0);
  const windowWidth = ref(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const currentMobileSlide = ref(0);

  const nextMobileSlide = (): void => {
    if (currentMobileSlide.value < Math.min(getTotalImagesCount(), 4) - 1) {
      currentMobileSlide.value++;
    }
  };

  const prevMobileSlide = (): void => {
    if (currentMobileSlide.value > 0) {
      currentMobileSlide.value--;
    }
  };

  const setMobileSlide = (index: number): void => {
    currentMobileSlide.value = index;
  };

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

  const formatDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const toggleFavorite = (): void => {
    isFavorite.value = !isFavorite.value;
  };

  const getMainImageUrl = (): string | null => {
    if (currentCompleteSmjestaj.value?.thumbnail) {
      return getSlikaUrl(currentCompleteSmjestaj.value.thumbnail);
    }
    return null;
  };

  const getGalleryImages = (): string[] => {
    const images: string[] = [];

    if (
      currentCompleteSmjestaj.value?.slike_smjestaj &&
      Array.isArray(currentCompleteSmjestaj.value.slike_smjestaj) &&
      currentCompleteSmjestaj.value.slike_smjestaj.length > 0
    ) {
      currentCompleteSmjestaj.value.slike_smjestaj.forEach((slikaItem: any) => {
        if (slikaItem.slika_smjestaj) {
          const url = getSlikaUrl(slikaItem.slika_smjestaj);
          if (url) images.push(url);
        }
      });
    }

    if (images.length === 0) {
      const mainImage = getMainImageUrl();
      if (mainImage) {
        return [mainImage, mainImage, mainImage, mainImage];
      } else {
        return [
          "/placeholder-apartment.jpg",
          "/placeholder-apartment.jpg",
          "/placeholder-apartment.jpg",
          "/placeholder-apartment.jpg",
        ];
      }
    }

    return images;
  };

  const getTotalImagesCount = (): number => {
    if (
      currentCompleteSmjestaj.value?.slike_smjestaj &&
      Array.isArray(currentCompleteSmjestaj.value.slike_smjestaj)
    ) {
      return currentCompleteSmjestaj.value.slike_smjestaj.length;
    }
    return 0;
  };

  const getAmenities = (): Sadrzaj[] => {
    const amenities: Sadrzaj[] = [];

    if (
      currentCompleteSmjestaj.value?.smjestaj_sadrzaji &&
      Array.isArray(currentCompleteSmjestaj.value.smjestaj_sadrzaji)
    ) {
      currentCompleteSmjestaj.value.smjestaj_sadrzaji.forEach(
        (item: { sadrzaj: any }) => {
          if (item && item.sadrzaj) {
            amenities.push(item.sadrzaj);
          }
        }
      );
    }

    return amenities;
  };

  const fetchCityAccommodations = async (city: string, limit: number = 3) => {
    if (!city) return;

    loadingCitySmjestaji.value = true;
    citySmjestajiError.value = null;

    try {
      const results = await fetchSmjestajiByCity(city, limit + 1);

      citySmjestaji.value = results
        .filter((smjestaj) => smjestaj.id !== currentCompleteSmjestaj.value?.id)
        .slice(0, limit);
    } catch (err) {
      console.error(`Error fetching accommodations for city "${city}":`, err);
      citySmjestajiError.value = `Failed to load accommodations for ${city}`;
    } finally {
      loadingCitySmjestaji.value = false;
    }
  };

  const goToDetail = (smjestaj: Smjestaj) => {
    const query = { ...route.query };

    router.push({
      path: `/smjestaj/${smjestaj.slug || smjestaj.id}`,
      query,
    });
  };

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

  const isGalleryOpen = ref(false);
  const currentImageIndex = ref(0);

  const galleryImages = computed(() => {
    return getGalleryImages();
  });

  const openGallery = (index: number = 0): void => {
    currentImageIndex.value = index;
    isGalleryOpen.value = true;
  };

  const closeGallery = (): void => {
    isGalleryOpen.value = false;
  };

  const nextImage = (): void => {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % galleryImages.value.length;
  };

  const prevImage = (): void => {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + galleryImages.value.length) %
      galleryImages.value.length;
  };

  const handleKeydown = (e: KeyboardEvent): void => {
    if (isGalleryOpen.value) {
      switch (e.key) {
        case "Escape":
          closeGallery();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
      }
    }
  };

  const setupAccommodation = async () => {
    if (slug.value) {
      await fetchCompleteSmjestajBySlug(slug.value);

      if (currentCompleteSmjestaj.value?.grad) {
        await fetchCityAccommodations(currentCompleteSmjestaj.value.grad, 5);
      }

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
    } else {
      console.error("No slug found in route params");
    }
  };

  // Setup window resize listener
  const setupWindowResizeListener = () => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        windowWidth.value = window.innerWidth;
      };

      window.addEventListener("resize", handleResize);

      onUnmounted(() => {
        window.removeEventListener("resize", handleResize);
      });
    }
  };

  const watchSlugChanges = () => {
    watch(slug, async (newSlug: string) => {
      if (newSlug) {
        await fetchCompleteSmjestajBySlug(newSlug);

        if (currentCompleteSmjestaj.value?.grad) {
          await fetchCityAccommodations(currentCompleteSmjestaj.value.grad, 3);
        }
      }
    });
  };

  const watchSwiperChanges = () => {
    watch(
      () => {
        const swiper = getSwiperInstance();
        return swiper?.activeIndex;
      },
      () => {
        updateActiveDot();
      }
    );
  };

  return {
    // State
    currentSmjestaj,
    currentCompleteSmjestaj,
    isLoading,
    error,
    isFavorite,
    selectedDates,
    swiperRef,
    activeDot,
    showDesktopControls,
    isGalleryOpen,
    currentImageIndex,
    galleryImages,
    currentMobileSlide,
    citySmjestaji,
    loadingCitySmjestaji,
    citySmjestajiError,

    // Methods
    formatPrice,
    formatPriceHRK,
    getSadrzajIconUrl,
    toggleFavorite,
    formatDate,
    getMainImageUrl,
    getGalleryImages,
    getTotalImagesCount,
    openGallery,
    getAmenities,
    formatTime,
    getThumbnailUrl,
    goToDetail,
    goToGroup,
    nextSlide,
    prevSlide,
    nextMobileSlide,
    setMobileSlide,
    prevMobileSlide,
    getSlikaUrl,
    navigateToSmjestaji,
    closeGallery,
    nextImage,
    prevImage,
    getSwiperInstance,
    updateActiveDot,
    fetchCityAccommodations,
    handleKeydown,

    // Setup methods
    setupAccommodation,
    setupWindowResizeListener,
    watchSlugChanges,
    watchSwiperChanges,
  };
}
