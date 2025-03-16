<script lang="ts">
import { useAuthStore } from "@/stores/authStore";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    const goToSmjestaji = () => {
      return navigateTo("/smjestaji");
    };

    return {
      user,
      goToSmjestaji,
    };
  },
});
</script>

<template>
  <div
    class="flex items-start justify-start min-h-screen bg-white px-4 pt-16 max-w-[650px] mx-auto"
  >
    <div class="bg-white rounded-lg p-8 text-center space-y-5">
      <div class="flex justify-center mb-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#F2F6F8" />
          <path
            d="M34 23.0799V23.9999C33.9988 26.1563 33.3005 28.2545 32.0093 29.9817C30.7182 31.7088 28.9033 32.9723 26.8354 33.5838C24.7674 34.1952 22.5573 34.1218 20.5345 33.3744C18.5117 32.6271 16.7847 31.246 15.611 29.4369C14.4373 27.6279 13.8798 25.4879 14.0217 23.3362C14.1636 21.1844 14.9972 19.1362 16.3983 17.4969C17.7994 15.8577 19.6928 14.7152 21.7962 14.24C23.8996 13.7648 26.1003 13.9822 28.07 14.8599"
            stroke="#337589"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M34 16L24 26.01L21 23.01"
            stroke="#337589"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <h2 class="text-2xl font-bold text-gray-80 text-[32px] mb-6">
        Zahvaljujemo se na upitu.
      </h2>

      <p class="text-gray-80 leading-relaxed text-xl mb-6">
        Ponudu ćemo Vam poslati u najkraćem mogućem roku putem e-maila.
      </p>

      <p class="text-gray-80 leading-relaxed mb-6 text-xl">
        Prosječno vrijeme slanja je najčešće unutar 24 sata. Ako ne budete
        primili odgovor u tom vremenu, provjerite mapu neželjene pošte (spam
        folder) ili nas kontaktirajte na info@erobnb.com.
      </p>

      <p class="text-gray-800 font-semibold mb-6">Vaš Crobnb</p>

      <button
        class="bg-primary-80 text-white px-4 py-3 rounded-md hover:bg-teal-700 transition-colors"
        @click="goToSmjestaji()"
      >
        Istrazi jos smjestaja
      </button>
    </div>
  </div>
</template>
