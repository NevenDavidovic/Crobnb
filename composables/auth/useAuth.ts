import { useCookie } from "#app";
import type {
  DirectusUser,
  AuthResponse,
} from "~/types/directus/exports/users";

export const useAuth = () => {
  const { $registerUser } = useNuxtApp();

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

  const router = useRouter();
  const config = useRuntimeConfig();

  // Check if user is already authenticated
  const authToken = useCookie("directus_auth_token");
  if (authToken.value) {
    isAuthenticated.value = true;
    // In a real app, you might want to verify the token and fetch user data
  }

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

      // Get role ID from runtime config
      const roleId = config.public.directusUserRoleId as string;

      // Create a complete user payload including the role
      const userPayload = {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        telefon: userData.telefon,
        role: roleId,
      };

      // Use the existing registerUser function from your plugin
      const response = await $registerUser(userPayload);

      if (response) {
        registrationSuccess.value = true;
      }

      isLoading.value = false;
      return response;
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle possible duplicate email error from Directus
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessage = err.errors[0]?.message;
        if (
          errorMessage &&
          (errorMessage.includes("duplicate") ||
            errorMessage.includes("email already exists"))
        ) {
          error.value = "Email već postoji u sustavu";
        } else {
          error.value = errorMessage || "Greška pri registraciji";
        }
      } else {
        error.value = err?.message || "Greška pri registraciji";
      }

      isLoading.value = false;
      return null;
    }
  };

  return {
    isLoading,
    error,
    isAuthenticated,
    registrationSuccess,
    user,
    registerUser,
  };
};
