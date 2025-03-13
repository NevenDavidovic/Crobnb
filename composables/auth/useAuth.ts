import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useCookie, useNuxtApp } from "#app";
import type {
  DirectusUser,
  AuthResponse,
} from "~/types/directus/exports/users";

export const useAuth = () => {
  const nuxtApp = useNuxtApp();
  const router = useRouter();

  // State management
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

  // Check if user is already authenticated via cookie
  const authToken = useCookie("directus_auth_token");
  if (authToken.value) {
    isAuthenticated.value = true;
  }

  /**
   * Register a new user with Directus
   */
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
      console.log("Starting user registration process");

      // Access Directus SDK from Nuxt app
      const { $registerUser } = nuxtApp;

      if (!$registerUser) {
        throw new Error("Direktus SDK nije dostupan");
      }

      const response = await $registerUser(userData);

      if (response) {
        registrationSuccess.value = true;
      }

      isLoading.value = false;
      return response;
    } catch (err: any) {
      // Error handling remains the same
      isLoading.value = false;
      return null;
    }
  };

  /**
   * Log in an existing user with Directus
   */
  const loginUser = async (credentials: {
    email: string;
    password: string;
  }) => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("Starting login process");

      // Access login function from Nuxt app
      const { $loginUser } = nuxtApp;

      if (!$loginUser) {
        throw new Error("Login funkcija nije dostupna");
      }

      // Execute login request
      const response = (await $loginUser(credentials)) as AuthResponse;
      console.log("Login response received:", response ? "Success" : "Failed");

      if (response && response.access_token) {
        isAuthenticated.value = true;

        // Set user data if available
        if (response.user) {
          user.id = response.user.id;
          user.email = response.user.email || "";
          user.first_name = response.user.first_name || "";
          user.last_name = response.user.last_name || "";
          user.telefon = response.user.telefon || "";
          console.log("User data set after login");
        }

        isLoading.value = false;
        return response;
      } else {
        error.value = "Prijava nije uspjela";
        isLoading.value = false;
        return null;
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle login-specific errors
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors[0]?.message;
        if (
          errorMessage &&
          (errorMessage.includes("credentials") ||
            errorMessage.includes("Invalid user credentials"))
        ) {
          error.value = "Pogrešan email ili lozinka";
        } else if (errorMessage && errorMessage.includes("not confirmed")) {
          error.value = "Korisnički račun nije potvrđen. Provjerite email.";
        } else {
          error.value = errorMessage || "Greška pri prijavi";
        }
      } else if (err.message) {
        if (err.message.includes("Network Error")) {
          error.value =
            "Problem s mrežnom vezom. Provjerite internet konekciju.";
        } else {
          error.value = err.message;
        }
      } else {
        error.value = "Greška pri prijavi";
      }

      isLoading.value = false;
      return null;
    }
  };

  /**
   * Log out the current user
   */
  const logoutUser = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      console.log("Starting logout process");

      // Access logout function from Nuxt app
      const { $logoutUser } = nuxtApp;

      if (!$logoutUser) {
        throw new Error("Logout funkcija nije dostupna");
      }

      // Execute logout
      await $logoutUser();
      console.log("Logout successful");

      isAuthenticated.value = false;

      // Reset user data
      user.id = "";
      user.email = "";
      user.first_name = "";
      user.last_name = "";
      user.telefon = "";

      // Redirect to home page
      router.push("/");

      isLoading.value = false;
      return true;
    } catch (err: any) {
      console.error("Logout error:", err);

      if (err.message) {
        error.value = err.message;
      } else {
        error.value = "Odjava nije uspjela";
      }

      isLoading.value = false;
      return false;
    }
  };

  // Return the composable API
  return {
    isLoading,
    error,
    isAuthenticated,
    registrationSuccess,
    user,
    registerUser,
    loginUser,
    logoutUser,
  };
};
