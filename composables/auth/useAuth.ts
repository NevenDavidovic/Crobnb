import { useCookie } from "#app";
import type { DirectusUser } from "~/types/directus/exports/users";

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
      await $registerUser(userPayload);

      // Ako smo došli do ovdje bez greške, registracija je uspjela
      registrationSuccess.value = true;
      isLoading.value = false;
      return true; // Vraćamo true jer je registracija uspjela
    } catch (err: any) {
      // Obrada grešaka ostaje ista
      console.error("Registration error:", err);

      // Ostatak koda za obradu grešaka...

      isLoading.value = false;
      return false; // Vraćamo false jer je došlo do greške
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
