<template>
  <div class="flex justify-center items-center min-h-screen bg-white">
    <div class="w-full max-w-md p-6 rounded shadow-sm">
      <h1 class="text-2xl font-semibold text-center mb-6">Registracija</h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col">
        <div class="mb-4">
          <label for="ime" class="block mb-2 text-gray-700">Ime*</label>
          <input
            id="ime"
            v-model="formData.ime"
            type="text"
            placeholder="Unesi ime"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            required
          />
        </div>

        <div class="mb-4">
          <label for="prezime" class="block mb-2 text-gray-700">Prezime*</label>
          <input
            id="prezime"
            v-model="formData.prezime"
            type="text"
            placeholder="Unesi prezime"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-2 text-gray-700">Email*</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Unesi email"
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            required
          />
        </div>

        <div class="mb-4">
          <label for="telefon" class="block mb-2 text-gray-700">Telefon</label>
          <div class="flex">
            <div class="w-16 mr-2">
              <input
                type="text"
                value="+385"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80 bg-gray-50"
                readonly
              />
            </div>
            <input
              id="telefon"
              v-model="formData.telefon"
              type="tel"
              class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="lozinka" class="block mb-2 text-gray-700">Lozinka*</label>
          <div class="relative">
            <input
              id="lozinka"
              v-model="formData.lozinka"
              :type="showPassword ? 'text' : 'password'"
              placeholder="********"
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

        <div class="mb-6">
          <label for="potvrdiLozinku" class="block mb-2 text-gray-700"
            >Potvrda lozinke*</label
          >
          <div class="relative">
            <input
              id="potvrdiLozinku"
              v-model="formData.potvrdiLozinku"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="********"
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-80"
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
        </div>

        <button
          type="submit"
          class="w-full py-2 max-w-[230px] mx-auto bg-primary-80 text-white rounded hover:bg-primary-90 transition duration-300"
        >
          Registriraj se
        </button>

        <div class="mt-3 text-center text-sm text-gray-600">
          <div class="mt-4 text-center">
            <p>
              Imaš korisnički račun?
              <NuxtLink to="/auth/prijava" class="text-gray-80 hover:underline">
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
export default defineComponent({
  setup() {
    const formData = reactive({
      ime: "",
      prezime: "",
      email: "",
      telefon: "",
      lozinka: "",
      potvrdiLozinku: "",
    });

    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const toggleConfirmPassword = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    const handleSubmit = () => {
      if (formData.lozinka !== formData.potvrdiLozinku) {
        alert("Lozinke se ne podudaraju");
        return;
      }

      console.log("Registration form submitted with:", formData);
    };

    return {
      formData,
      showPassword,
      showConfirmPassword,
      togglePassword,
      toggleConfirmPassword,
      handleSubmit,
    };
  },
});
</script>
