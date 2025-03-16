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

  const config = useRuntimeConfig();

  const authToken = useCookie("directus_auth_token");
  if (authToken.value) {
    isAuthenticated.value = true;
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
    } catch (err: any) {
      console.error("Registration error:", err);

      isLoading.value = false;
      return false;
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
