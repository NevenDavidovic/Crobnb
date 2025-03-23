import { useCookie } from "#app";
import type { DirectusUser, ApiError } from "~/types/directus";

export const useAuth = () => {
  const {
    $registerUser,
    $loginUser,
    $logoutUser,
    $refreshToken,
    $getCurrentUser,
  } = useNuxtApp();

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const registrationSuccess = ref(false);
  const user = reactive<Partial<DirectusUser>>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    telefon: "",
  });

  const config = useRuntimeConfig();

  // Set cookies with proper persistence options
  const accessToken = useCookie("directus_access_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  const refreshTokenCookie = useCookie("directus_refresh_token", {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

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
        error.value = err.errors[0]?.message || "Error during login";
      } else {
        error.value = err.message || "Error during login";
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
      Object.assign(user, {
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        telefon: "",
      });
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
      Object.assign(user, userData);
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
      logout(false);
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
    } else if (user.id === "") {
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

  const registerUser = async (userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    telefon?: string;
  }) => {
    isLoading.value = true;
    error.value = null;
    registrationSuccess.value = false;

    try {
      const roleId = config.public.directusUserRoleId as string;

      const userPayload = {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        telefon: userData.telefon,
        role: roleId,
      };

      await $registerUser(userPayload);

      registrationSuccess.value = true;
      isLoading.value = false;
      return true;
    } catch (err: unknown) {
      console.error("Registration error:", err);

      if (err && typeof err === "object") {
        const apiError = err as ApiError;

        if (apiError.errors && apiError.errors.length > 0) {
          error.value = apiError.errors[0].message;
        } else if (apiError.message) {
          error.value = apiError.message;
        } else {
          error.value = "Registration failed";
        }

        if (apiError.errors?.[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
          error.value = "An account with this email already exists";
        }
      } else {
        error.value = "An unexpected error occurred";
      }

      isLoading.value = false;
      return false;
    }
  };

  const initAuth = async () => {
    if (accessToken.value || refreshTokenCookie.value) {
      if (accessToken.value) {
        isAuthenticated.value = true;
        const success = await fetchCurrentUser();

        if (!success && refreshTokenCookie.value) {
          const refreshed = await refreshAuthToken();
          if (refreshed) {
            await fetchCurrentUser();
          } else {
            isAuthenticated.value = false;
          }
        } else if (!success) {
          isAuthenticated.value = false;
        }
      } else if (refreshTokenCookie.value) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          isAuthenticated.value = true;
          await fetchCurrentUser();
        }
      }
    }
  };
  onMounted(() => {
    if (process.client) {
      initAuth();
    }
  });

  return {
    isLoading,
    error,
    isAuthenticated,
    registrationSuccess,
    user,
    login,
    logout,
    registerUser,
    checkAuth,
    refreshAuthToken,
    fetchCurrentUser,
    initAuth,
  };
};
