<template>
  <div class="flex justify-center items-start min-h-screen bg-white">
    <div class="w-full max-w-md p-6 rounded shadow-sm">
      <h1 class="text-2xl font-semibold text-center mb-6">Prijava</h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col">
        <div class="mb-6">
          <label for="email" class="block mb-2 text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Unesi email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-700">Lozinka</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Unesi lozinku"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
              required
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                :class="{ 'text-gray-600': showPassword }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="!showPassword"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  v-if="!showPassword"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                <path
                  v-if="showPassword"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="authStore.error" class="text-red-500 mb-4">
          {{ authStore.error }}
        </div>

        <div class="flex justify-end mb-6">
          <NuxtLink
            to="/auth/zaboravljena-lozinka"
            class="text-primary-80 hover:underline"
          >
            Zaboravljena lozinka?
          </NuxtLink>
        </div>

        <button
          type="submit"
          class="w-full max-w-[230px] mx-auto py-3 bg-primary-80 px-20 text-white rounded hover:bg-primary-90 transition duration-300"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? "Učitavanje..." : "Prijavi se" }}
        </button>

        <div class="mt-4 text-center">
          <p>
            Nemaš korisnički račun?
            <NuxtLink
              to="/auth/registration"
              class="text-gray-80 hover:underline"
            >
              Registriraj se
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import type { PrijavaCardProps } from "~/types/pages/prijava-card-props";
import type { Toast } from "~/types/pages/toast";

export default defineComponent({
  props: {
    redirectUrl: {
      type: String,
      default: "",
    },
  },

  setup(props: PrijavaCardProps) {
    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      if (!email.value || !password.value) {
        return;
      }

      const success = await authStore.login(email.value, password.value);

      if (success) {
        try {
          const nuxtApp = useNuxtApp();
          const toast = nuxtApp.$toast as Toast;
          toast.success("Uspješna prijava!");
        } catch (err) {
          console.log("Toast nije dostupan", err);
        }

        if (props.redirectUrl) {
          router.push(props.redirectUrl);
        } else {
          router.push("/profil");
        }
      }
    };

    return {
      email,
      password,
      showPassword,
      togglePassword,
      handleSubmit,
      authStore,
    };
  },
});
</script>
