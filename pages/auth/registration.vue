<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="w-full max-w-md p-6 rounded shadow-sm">
      <h1 class="text-2xl font-semibold text-center mb-6">Registracija</h1>

      <!-- Success message -->
      <div
        v-if="registrationSuccess"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
      >
        <p class="font-bold">Uspješna registracija!</p>
        <p>
          Provjerite svoj email za potvrdu računa. Preusmjeravamo vas na
          stranicu za prijavu...
        </p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="flex flex-col">
        <div class="mb-4">
          <label for="ime" class="block mb-2 font-bold text-gray-700"
            >Ime*</label
          >
          <input
            id="ime"
            v-model="formData.ime"
            type="text"
            placeholder="Unesi ime"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            :class="{
              'border-red-500': errors.ime,
              'border-gray-300': !errors.ime,
            }"
            @blur="validateField('ime')"
            required
          />
          <p v-if="errors.ime" class="mt-1 text-sm text-red-500">
            {{ errors.ime }}
          </p>
        </div>

        <div class="mb-4">
          <label for="prezime" class="block mb-2 text-gray-700 font-bold"
            >Prezime*</label
          >
          <input
            id="prezime"
            v-model="formData.prezime"
            type="text"
            placeholder="Unesi prezime"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            :class="{
              'border-red-500': errors.prezime,
              'border-gray-300': !errors.prezime,
            }"
            @blur="validateField('prezime')"
            required
          />
          <p v-if="errors.prezime" class="mt-1 text-sm text-red-500">
            {{ errors.prezime }}
          </p>
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-2 text-gray-700 font-bold"
            >Email*</label
          >
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Unesi email"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            :class="{
              'border-red-500': errors.email,
              'border-gray-300': !errors.email,
            }"
            @blur="validateField('email')"
            required
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <div class="mb-4">
          <label for="telefon" class="block mb-2 text-gray-700 font-bold"
            >Telefon</label
          >
          <vue-tel-input
            v-model="formData.telefon"
            :valid-characters-only="false"
            :auto-format="true"
            :mode="'international'"
            @validate="validatePhone"
            :input-options="{
              placeholder: 'Unesite broj telefona',
              id: 'telefon',
              class: 'phone-input w-full',
            }"
            :dropdown-options="{
              showDialCodeInSelection: true,
              showFlags: true,
              showDialCodeInList: true,
            }"
            class="phone-input-container"
            :class="{
              'phone-error': errors.telefon,
            }"
          >
          </vue-tel-input>
          <p v-if="errors.telefon" class="mt-1 text-sm text-red-500">
            {{ errors.telefon }}
          </p>
        </div>

        <div class="mb-4">
          <label for="lozinka" class="block mb-2 text-gray-700 font-bold"
            >Lozinka*</label
          >
          <div class="relative">
            <input
              id="lozinka"
              v-model="formData.lozinka"
              :type="showPassword ? 'text' : 'password'"
              placeholder="********"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
              :class="{
                'border-red-500': errors.lozinka,
                'border-gray-300': !errors.lozinka,
              }"
              @blur="validateField('lozinka')"
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
          <p v-if="errors.lozinka" class="mt-1 text-sm text-red-500">
            {{ errors.lozinka }}
          </p>
          <div v-if="formData.lozinka" class="mt-2">
            <p class="text-xs text-gray-600 mb-1 font-bold">
              Lozinka mora sadržavati:
            </p>
            <ul class="text-xs">
              <li
                :class="
                  passwordCriteria.length ? 'text-green-500' : 'text-gray-500'
                "
              >
                Minimalno 8 znakova
              </li>
              <li
                :class="
                  passwordCriteria.uppercase
                    ? 'text-green-500'
                    : 'text-gray-500'
                "
              >
                Jedno veliko slovo
              </li>
              <li
                :class="
                  passwordCriteria.lowercase
                    ? 'text-green-500'
                    : 'text-gray-500'
                "
              >
                Jedno malo slovo
              </li>
              <li
                :class="
                  passwordCriteria.number ? 'text-green-500' : 'text-gray-500'
                "
              >
                Jedan broj
              </li>
              <li
                :class="
                  passwordCriteria.special ? 'text-green-500' : 'text-gray-500'
                "
              >
                Jedan specijalni znak (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div class="mb-6">
          <label for="potvrdiLozinku" class="block mb-2 text-gray-700 font-bold"
            >Potvrda lozinke*</label
          >
          <div class="relative">
            <input
              id="potvrdiLozinku"
              v-model="formData.potvrdiLozinku"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="********"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
              :class="{
                'border-red-500': errors.potvrdiLozinku,
                'border-gray-300': !errors.potvrdiLozinku,
              }"
              @blur="validateField('potvrdiLozinku')"
              required
            />
            <button
              type="button"
              @click="toggleConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="!showConfirmPassword"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  v-if="!showConfirmPassword"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                <path
                  v-if="showConfirmPassword"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
          <p v-if="errors.potvrdiLozinku" class="mt-1 text-sm text-red-500">
            {{ errors.potvrdiLozinku }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full py-2 max-w-[230px] mx-auto bg-primary-80 text-white rounded hover:bg-primary-90 transition duration-300"
          :disabled="!isFormValid || isLoading"
          :class="{
            'opacity-50 cursor-not-allowed': !isFormValid || isLoading,
          }"
        >
          <template v-if="isLoading">
            <span class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registracija u tijeku...
            </span>
          </template>
          <template v-else> Registriraj se </template>
        </button>

        <div class="mt-3 text-center text-sm text-gray-600">
          <div class="mt-4 text-center">
            <p>
              Imaš korisnički račun?
              <NuxtLink
                to="/auth/prijava"
                class="text-primary-80 hover:underline"
              >
                Prijavi se
              </NuxtLink>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import "~/assets/css/vue-tel-input.css";
// In your plugin

import { useRegistrationForm } from "~/composables/auth/validation";

export default defineComponent({
  setup() {
    // Use the composable to manage form state and validation
    const {
      formData,
      errors,
      passwordCriteria,
      showPassword,
      showConfirmPassword,
      isFormValid,
      isLoading,
      registrationSuccess,
      togglePassword,
      toggleConfirmPassword,
      validateField,
      handleSubmit,
      validatePhone,
    } = useRegistrationForm();

    // Return all the values needed by the template
    return {
      formData,
      errors,
      passwordCriteria,
      showPassword,
      showConfirmPassword,
      isFormValid,
      isLoading,
      registrationSuccess,
      togglePassword,
      toggleConfirmPassword,
      validateField,
      handleSubmit,
      validatePhone,
    };
  },
});
</script>

<style scoped>
.phone-input-container {
  @apply w-full;
}

.phone-input-container :deep(.vti__dropdown) {
  @apply rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-80;
}

.phone-input-container :deep(.vti__input) {
  @apply rounded-r border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-80 w-full;
}

.phone-input-container.phone-error :deep(.vti__dropdown),
.phone-input-container.phone-error :deep(.vti__input) {
  @apply border-red-500;
}

.phone-input-container :deep(.vti__dropdown-item) {
  @apply py-2;
}
</style>
