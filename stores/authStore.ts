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
        accessToken.value = response.access_token;
        if (response.refresh_token) {
          refreshTokenCookie.value = response.refresh_token;
        }

        isAuthenticated.value = true;
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

  const logout = async (redirect: boolean = true) => {
    try {
      if (isAuthenticated.value && refreshTokenCookie.value) {
        try {
          await $logoutUser(refreshTokenCookie.value);
        } catch (apiError) {
          console.error(
            "Server logout failed, proceeding with local logout:",
            apiError
          );
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clean up local state
      user.value = null;
      isAuthenticated.value = false;
      accessToken.value = null;
      refreshTokenCookie.value = null;

      if (redirect) {
        const router = useRouter();
        router.push("/");
      }
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = await $getCurrentUser();
      user.value = userData as DirectusUserResponse;
      return true;
    } catch (err: unknown) {
      console.error("Error fetching current user:", err);
      return false;
    }
  };

  const refreshAuthToken = async () => {
    try {
      if (!refreshTokenCookie.value) {
        throw new Error("No refresh token available");
      }

      const response = await $refreshToken(refreshTokenCookie.value);

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

    if (!isAuthenticated.value) {
      isAuthenticated.value = true;

      const success = await fetchCurrentUser();

      if (!success) {
        isAuthenticated.value = false;

        if (refreshTokenCookie.value) {
          const refreshed = await refreshAuthToken();
          if (!refreshed) {
            return false;
          }

          const retrySuccess = await fetchCurrentUser();
          isAuthenticated.value = retrySuccess;
          return retrySuccess;
        }

        return false;
      }
    } else if (!user.value) {
      const success = await fetchCurrentUser();
      if (!success) {
        if (refreshTokenCookie.value) {
          const refreshed = await refreshAuthToken();
          if (refreshed) {
            const retrySuccess = await fetchCurrentUser();
            return retrySuccess;
          }
        }

        isAuthenticated.value = false;
        return false;
      }
    }

    return isAuthenticated.value;
  };

  onMounted(() => {
    if (accessToken.value) {
      isAuthenticated.value = true;
      fetchCurrentUser();
    }
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
