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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-2xl font-semibold text-center mb-2">Resetiraj lozinku</h1>

      <p class="text-center text-gray-600 mb-8">Molimo unesite novu lozinku.</p>

      <div
        v-if="!token"
        class="text-center p-4 bg-red-50 text-red-700 rounded mb-6"
      >
        Nedostaje token za resetiranje lozinke. Molimo koristite link iz emaila.
      </div>

      <!-- Success message -->
      <div
        v-if="isSuccess"
        class="mb-6 p-4 rounded text-center bg-green-50 text-green-700"
      >
        {{ message }}
        <p class="mt-2">Preusmjeravamo vas na stranicu za prijavu...</p>
      </div>

      <!-- Error message -->
      <div
        v-if="error && !isSuccess"
        class="mb-6 p-4 rounded text-center bg-red-50 text-red-700"
      >
        {{ error }}
      </div>

      <form
        v-if="token && !isSuccess"
        @submit.prevent="resetPassword"
        class="flex flex-col"
      >
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-700 font-bold"
            >Nova lozinka</label
          >
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="********"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
              :class="{
                'border-red-500': passwordError,
                'border-gray-300': !passwordError,
              }"
              required
              :disabled="isSubmitting"
              @input="validatePassword"
              minlength="8"
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
          <p v-if="passwordError" class="mt-1 text-sm text-red-500">
            {{ passwordError }}
          </p>
          <div v-if="password" class="mt-2">
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

        <div class="mb-8">
          <label
            for="confirmPassword"
            class="block mb-2 text-gray-700 font-bold"
            >Potvrdi novu lozinku</label
          >
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="********"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
              :class="{
                'border-red-500': confirmPasswordError,
                'border-gray-300': !confirmPasswordError,
              }"
              required
              :disabled="isSubmitting"
              @input="validateConfirmPassword"
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
          <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-500">
            {{ confirmPasswordError }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full py-3 max-w-[230px] mx-auto bg-primary-80 text-white rounded hover:bg-primary-90 transition duration-300"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting">Resetiranje...</span>
          <span v-else>Resetiraj lozinku</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const authStore = useAuthStore();

    const {
      token,
      password,
      confirmPassword,
      isSubmitting,
      message,
      isSuccess,
      error,
      resetPassword: originalResetPassword,
    } = useResetPassword();

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const passwordError = ref("");
    const confirmPasswordError = ref("");

    const passwordCriteria = reactive({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    const validatePassword = () => {
      passwordError.value = "";

      passwordCriteria.length = password.value.length >= 8;
      passwordCriteria.uppercase = /[A-Z]/.test(password.value);
      passwordCriteria.lowercase = /[a-z]/.test(password.value);
      passwordCriteria.number = /[0-9]/.test(password.value);
      passwordCriteria.special = /[!@#$%^&*]/.test(password.value);

      // Validate password
      if (!password.value) {
        passwordError.value = "Lozinka je obavezna";
      } else if (password.value.length < 8) {
        passwordError.value = "Lozinka mora sadržavati najmanje 8 znakova";
      } else if (!/[A-Z]/.test(password.value)) {
        passwordError.value =
          "Lozinka mora sadržavati barem jedno veliko slovo";
      } else if (!/[a-z]/.test(password.value)) {
        passwordError.value = "Lozinka mora sadržavati barem jedno malo slovo";
      } else if (!/[0-9]/.test(password.value)) {
        passwordError.value = "Lozinka mora sadržavati barem jedan broj";
      } else if (!/[!@#$%^&*]/.test(password.value)) {
        passwordError.value =
          "Lozinka mora sadržavati barem jedan specijalni znak (!@#$%^&*)";
      }

      if (confirmPassword.value) {
        validateConfirmPassword();
      }
    };

    const validateConfirmPassword = () => {
      confirmPasswordError.value = "";

      if (!confirmPassword.value) {
        confirmPasswordError.value = "Potvrda lozinke je obavezna";
      } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.value = "Lozinke se ne podudaraju";
      }
    };

    const isFormValid = computed(() => {
      return (
        !!password.value &&
        !!confirmPassword.value &&
        !passwordError.value &&
        !confirmPasswordError.value &&
        password.value === confirmPassword.value &&
        passwordCriteria.length &&
        passwordCriteria.uppercase &&
        passwordCriteria.lowercase &&
        passwordCriteria.number &&
        passwordCriteria.special
      );
    });

    const resetPassword = async () => {
      validatePassword();
      validateConfirmPassword();

      if (isFormValid.value) {
        await originalResetPassword();
      }
    };

    watch(password, () => {
      validatePassword();
    });

    return {
      token,
      password,
      confirmPassword,
      isSubmitting,
      message,
      isSuccess,
      error,
      resetPassword,
      showPassword,
      showConfirmPassword,
      passwordError,
      confirmPasswordError,
      passwordCriteria,
      togglePassword,
      toggleConfirmPassword,
      validatePassword,
      validateConfirmPassword,
      isFormValid,
    };
  },
});
</script>
