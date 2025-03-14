<template>
  <div class="max-w-1200 mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Upit za rezervaciju</h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Left side - Form -->
      <div class="w-full lg:w-2/3">
        <h2 class="text-xl font-medium mb-6">Unesi podatke</h2>

        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="ime" class="block mb-2 text-sm">Ime*</label>
            <input
              id="ime"
              v-model="form.ime"
              type="text"
              class="w-full border border-gray-5 rounded p-2"
              required
            />
          </div>

          <div class="mb-4">
            <label for="prezime" class="block mb-2 text-sm">Prezime*</label>
            <input
              id="prezime"
              v-model="form.prezime"
              type="text"
              class="w-full border border-gray-5 rounded p-2"
              required
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block mb-2 text-sm">Email*</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full border border-gray-5 rounded p-2"
              required
            />
          </div>

          <div class="mb-4">
            <label for="telefon" class="block mb-2 text-sm">Telefon*</label>
            <input
              id="telefon"
              v-model="form.telefon"
              type="tel"
              class="w-full border border-gray-5 rounded p-2"
              required
            />
          </div>

          <div class="mb-4">
            <label for="drzava" class="block mb-2 text-sm">Država*</label>
            <input
              id="drzava"
              v-model="form.drzava"
              type="text"
              class="w-full border border-gray-5 rounded p-2"
              required
            />
          </div>

          <div class="mb-6">
            <label for="poruka" class="block mb-2 text-sm">Poruka</label>
            <textarea
              id="poruka"
              v-model="form.poruka"
              class="w-full border border-gray-5 rounded p-2 h-24"
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-primary-80 hover:bg-primary-100 text-white font-medium py-2 px-h min-w-[133px] rounded"
          >
            Pošalji upit
          </button>
        </form>
      </div>

      <!-- Right side - Reservation Summary -->
      <div class="w-full lg:w-1/3 mt-8 lg:mt-0">
        <div class="border border-gray-200 rounded-lg p-6">
          <h2 class="text-xl font-medium mb-4">Sažetak rezervacije</h2>

          <div class="mb-4">
            <img
              src="./apartment-image.jpg"
              alt="Split Inn Apartments"
              class="w-full h-auto object-cover rounded"
            />
          </div>

          <div class="flex items-center mb-2">
            <div class="flex text-yellow-400">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span class="text-gray-300">★</span>
            </div>
          </div>

          <h3 class="text-xl font-medium mb-2">Split Inn Apartments</h3>

          <div class="flex items-start mb-4">
            <span class="text-blue-500 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span class="ml-2 text-gray-600">Križeva ul. 9, 21000, Split</span>
          </div>

          <div class="pt-4">
            <div class="grid grid-cols-4 gap-2 mb-2">
              <div class="text-sm text-gray-600">Datum prijave</div>
              <div class="text-sm text-gray-600">Datum odjave</div>
              <div class="text-sm text-gray-600">Gosti</div>
              <div class="text-sm text-gray-600">Noćenja</div>
            </div>

            <div class="grid grid-cols-4 gap-2 mb-4">
              <div class="font-medium">02/03/2023</div>
              <div class="font-medium">03/03/2023</div>
              <div class="font-medium">2 odrasli</div>
              <div class="font-medium">1 noćenje</div>
            </div>
          </div>

          <div class="pt-4">
            <div class="mb-1 font-medium">Ukupna cijena</div>
            <div class="text-lg font-bold">92.65 EUR</div>
            <div class="text-sm text-gray-500">698.11 HRK</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  ime: "",
  prezime: "",
  email: "",
  telefon: "",
  drzava: "",
  poruka: "",
});

const submitForm = () => {
  console.log("Form submitted:", form.value);
  // Here you would handle the form submission
  // e.g., call an API endpoint
};
</script>
