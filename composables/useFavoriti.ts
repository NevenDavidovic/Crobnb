import type { Favoriti } from "~/types/directus/exports/favoriti";
import mitt, { type Emitter } from "mitt";

type FavoriteChangeEvent = {
  action: "add" | "remove";
  smjestajId?: number;
  favoriteId?: number;
};

type Events = {
  "favorites-changed": FavoriteChangeEvent;
};

const emitter = mitt<Events>();

export const useFavoriti = () => {
  const { $addFavorite, $getFavorites, $removeFavorite } = useNuxtApp();
  const authStore = useAuthStore();

  const favorites = ref<Favoriti[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const user = computed(() => authStore.user);

  const fetchFavorites = async () => {
    if (!user.value) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getFavorites(user.value.id);

      const processedFavorites = Array.isArray(response)
        ? response
        : [response];

      favorites.value = processedFavorites.map((favorite) => {
        if (favorite.smjestaj) {
          if (
            favorite.smjestaj.sadrzaji &&
            !favorite.smjestaj.smjestaj_sadrzaji
          ) {
            favorite.smjestaj.smjestaj_sadrzaji = favorite.smjestaj.sadrzaji;
          } else if (
            favorite.smjestaj.smjestaj_sadrzaji &&
            !favorite.smjestaj.sadrzaji
          ) {
            favorite.smjestaj.sadrzaji = favorite.smjestaj.smjestaj_sadrzaji;
          }
        }
        return favorite;
      });

      if (favorites.value.length > 0) {
        const firstFav = favorites.value[0];
      }
    } catch (err) {
      error.value = "Failed to fetch favorites";
      console.error("[useFavoriti] Error fetching favorites:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const addFavorite = async (smjestajId: number) => {
    if (!user.value) {
      console.warn("[useFavoriti] Cannot add favorite: User not logged in");
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $addFavorite(user.value.id, smjestajId);
      await fetchFavorites();

      // Emit a global event that favorites have changed
      emitter.emit("favorites-changed", { action: "add", smjestajId });

      return response;
    } catch (err) {
      error.value = "Failed to add favorite";
      console.error("[useFavoriti] Error adding favorite:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const onFavoritesChanged = (
    callback: (event: FavoriteChangeEvent) => void
  ) => {
    emitter.on("favorites-changed", callback);
    return () => emitter.off("favorites-changed", callback); // Return cleanup function
  };

  const removeFavorite = async (favoriteId: number) => {
    if (!user.value) {
      console.warn("[useFavoriti] Cannot remove favorite: User not logged in");
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      await $removeFavorite(favoriteId);
      await fetchFavorites();

      // Emit a global event that favorites have changed
      emitter.emit("favorites-changed", { action: "remove", favoriteId });
    } catch (err) {
      error.value = "Failed to remove favorite";
      console.error("[useFavoriti] Error removing favorite:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const isFavorite = (smjestajId: number) => {
    if (!user.value) {
      return false;
    }
    return favorites.value.some((fav) => fav.smjestaj_id === smjestajId);
  };

  watch(
    user,
    (newUser) => {
      console.log(
        "[useFavoriti] User changed:",
        newUser?.id || "not logged in"
      );
      if (newUser) {
        fetchFavorites();
      } else {
        favorites.value = [];
      }
    },
    { immediate: true }
  );

  return {
    favorites: computed(() => favorites.value),
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    isFavorite,
    onFavoritesChanged,
  };
};
