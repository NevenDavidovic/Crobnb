// stores/authStore.ts
import { defineStore } from "pinia";
import { useCookie } from "#app";
import type { DirectusUserResponse } from "~/types/pages/directus-user-response";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<DirectusUserResponse | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const accessToken = useCookie("directus_access_token");
  const refreshTokenCookie = useCookie("directus_refresh_token");

  const { $loginUser, $logoutUser, $refreshToken, $getCurrentUser } =
    useNuxtApp();

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $loginUser({ email, password });

      if (response && response.access_token) {
        // Store tokens in cookies
        accessToken.value = response.access_token;
        if (response.refresh_token) {
          refreshTokenCookie.value = response.refresh_token;
        }

        // Set authentication state
        isAuthenticated.value = true;

        // Fetch user data
        await fetchCurrentUser();

        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.errors && Array.isArray(err.errors)) {
        error.value = err.errors[0]?.message || "Greška prilikom prijave";
      } else {
        error.value = err.message || "Greška prilikom prijave";
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated.value) {
        await $logoutUser();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear state regardless of API success
      user.value = null;
      isAuthenticated.value = false;
      accessToken.value = null;
      refreshTokenCookie.value = null;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = await $getCurrentUser();
      user.value = userData as DirectusUserResponse;
      return true;
    } catch (err) {
      console.error("Error fetching current user:", err);
      return false;
    }
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshTokenCookie.value) {
        throw new Error("Nema refresh tokena");
      }

      const response = await $refreshToken();

      if (response && response.access_token) {
        accessToken.value = response.access_token;
        if (response.refresh_token) {
          refreshTokenCookie.value = response.refresh_token;
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Refresh token error:", err);
      logout();
      return false;
    }
  };

  const checkAuth = async () => {
    if (!accessToken.value) {
      return false;
    }

    if (isAuthenticated.value && !user.value) {
      // Imamo token ali nemamo podatke o korisniku
      await fetchCurrentUser();
    }

    return isAuthenticated.value;
  };

  // Provjeri autentikaciju pri inicijalizaciji
  const initAuth = () => {
    if (accessToken.value) {
      isAuthenticated.value = true;
      fetchCurrentUser(); // Dohvati podatke o korisniku ako token postoji
    }
  };

  // Pozovi inicijalizaciju pri montiranju
  onMounted(() => {
    initAuth();
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshAuthToken,
    checkAuth,
    fetchCurrentUser,
  };
});
