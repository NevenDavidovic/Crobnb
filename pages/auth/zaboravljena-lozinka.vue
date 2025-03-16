<template>
  <div class="flex justify-center items-start min-h-screen pt-16 bg-white">
    <div class="w-full max-w-md p-6 rounded shadow-sm">
      <div class="flex justify-center mb-4">
        <div
          class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-primary-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-2xl font-semibold text-center mb-2">
        Zaboravljena lozinka?
      </h1>

      <p class="text-center text-gray-600 mb-8">
        Upiši email i poslat ćemo ti link za resetiranje lozinke.
      </p>

      <!-- Success or error message -->
      <div
        v-if="isSuccess"
        class="mb-6 p-4 rounded text-center bg-green-50 text-green-700"
      >
        {{ message }}
      </div>

      <div
        v-if="error && !isSuccess"
        class="mb-6 p-4 rounded text-center bg-red-50 text-red-700"
      >
        {{ error }}
      </div>

      <form
        v-if="!isSuccess"
        @submit.prevent="requestReset"
        class="flex flex-col"
      >
        <div class="mb-8">
          <label for="email" class="block mb-2 text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Upiši email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            required
            :disabled="isSubmitting"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 max-w-[230px] mx-auto bg-primary-80 text-white rounded hover:bg-primary-90 transition duration-300"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Slanje...</span>
          <span v-else>Pošalji</span>
        </button>
      </form>

      <!-- Show back to login button when successful -->
      <div v-if="isSuccess" class="text-center mt-4">
        <NuxtLink
          to="/auth/prijava"
          class="px-6 py-2 bg-primary-80 text-white rounded hover:bg-primary-90 transition duration-300"
        >
          Natrag na prijavu
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePasswordReset } from "~/composables/passwordReset/usePasswordReset";

export default defineComponent({
  setup() {
    const { email, isSubmitting, message, isSuccess, error, requestReset } =
      usePasswordReset();

    return {
      email,
      isSubmitting,
      message,
      isSuccess,
      error,
      requestReset,
    };
  },
});
</script>
