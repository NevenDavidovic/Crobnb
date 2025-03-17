<template>
  <div class="max-w-1200 px-4 mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">Moji Favoriti</h1>

    <div v-if="isLoading" class="flex justify-center my-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchFavorites"
        class="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>

    <!-- Favorite accommodations grid -->
    <SmjestajGrid
      v-else
      :smjestaji="typedSmjestaji"
      :is-loading="false"
      :error="null"
      :get-thumbnail-url="getThumbnailUrl"
      :format-price="formatPrice"
      :format-price-h-r-k="formatPriceHRK"
      :get-sadrzaj-icon-url="getSadrzajIconUrl"
      :items-per-page="itemsPerPage"
      :use-mobile-layout="true"
      @before-mount="logGridProps"
    />

    <!-- Empty state -->
    <p
      v-if="!isLoading && !error && typedSmjestaji.length === 0"
      class="text-gray-600 text-center py-10"
    >
      Nema favoriziranih smještaja.
    </p>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  // Apply auth middleware to this page
  middleware: "auth",

  setup() {
    const { favorites, isLoading, error, fetchFavorites, onFavoritesChanged } =
      useFavoriti();
    const { getThumbnailUrl, formatPrice, formatPriceHRK, getSadrzajIconUrl } =
      useSmjestaji();

    const authStore = useAuthStore();
    console.log("[Favoriti] Auth state:", {
      isAuthenticated: authStore.isAuthenticated,
      hasUser: !!authStore.user,
      userId: authStore.user?.id || "not available",
    });

    const itemsPerPage = ref(10);

    const typedSmjestaji = computed(() => {
      const filtered = favorites.value.filter((fav) => {
        const hasSmjestaj = fav && fav.smjestaj;
        if (!hasSmjestaj) {
          console.warn(
            "[Favoriti] Found favorite without smjestaj property:",
            fav
          );
        }
        return hasSmjestaj;
      });

      const mapped = filtered.map((fav) => {
        // Ensure smjestaj_sadrzaji exists if sadrzaji does
        if (fav.smjestaj.sadrzaji && !fav.smjestaj.smjestaj_sadrzaji) {
          fav.smjestaj.smjestaj_sadrzaji = fav.smjestaj.sadrzaji;
        }
        // Or vice versa
        else if (fav.smjestaj.smjestaj_sadrzaji && !fav.smjestaj.sadrzaji) {
          fav.smjestaj.sadrzaji = fav.smjestaj.smjestaj_sadrzaji;
        }

        return fav.smjestaj;
      });

      return mapped;
    });

    const logGridProps = () => {
      if (typedSmjestaji.value.length > 0) {
        console.log("[Favoriti] SmjestajGrid Items Summary:");
        typedSmjestaji.value.forEach((item, index) => {
          console.log(`[Favoriti] Item ${index + 1}:`, {
            id: item.id,
            naziv: item.naziv,
            cijena: item.cijena_nocenja,
            hasRegija: !!item.regija,
            hasThumbnail: !!item.thumbnail,
            hasTipSmjestaja: !!item.tip_smjestaja,
            sadrzajiCount: item.sadrzaji?.length || 0,
            smjestajSadrzajiCount: item.smjestaj_sadrzaji?.length || 0,
          });
        });
      }
    };

    watch(typedSmjestaji, (newVal) => {
      logGridProps();
    });

    onMounted(() => {
      if (!authStore.isAuthenticated) {
        return navigateTo("/auth/prijava");
      }

      const unsubscribe = onFavoritesChanged(() => {
        console.log("[Favoriti] Received favorites-changed event, refreshing");
        fetchFavorites();
      });

      onUnmounted(() => {
        unsubscribe();
      });

      fetchFavorites().catch((err) => {
        console.error("[Favoriti] Error fetching favorites:", err);
      });
    });

    return {
      typedSmjestaji,
      isLoading,
      error,
      fetchFavorites,
      getThumbnailUrl,
      formatPrice,
      formatPriceHRK,
      getSadrzajIconUrl,
      itemsPerPage,
      logGridProps,
    };
  },
};
</script>
