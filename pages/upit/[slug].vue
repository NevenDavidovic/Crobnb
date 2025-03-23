<template>
  <div class="max-w-1200 mx-auto px-4 py-8 md:mt-16">
    <div v-if="isLoading" class="text-center py-16">
      <p class="text-xl">Učitavanje detalja smještaja...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-xl text-red-500">{{ error }}</p>
    </div>

    <div v-else>
      <h1 class="text-[40px] font-bold mb-8">Upit za rezervaciju</h1>

      <div class="flex flex-col-reverse lg:flex-row gap-8 justify-between">
        <div class="w-full mx-auto md:max-w-[698px]">
          <h2 class="text-xl font-medium mb-6">Unesi podatke</h2>

          <form @submit.prevent="submitForm">
            <div>
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
              <label for="poruka" class="block mb-2 text-sm">Poruka*</label>
              <textarea
                required
                id="poruka"
                v-model="form.poruka"
                class="w-full border border-gray-5 rounded p-2 h-24"
              ></textarea>
            </div>

            <button
              type="submit"
              class="bg-primary-80 hover:bg-primary-100 text-white font-medium py-2 px-h min-w-[133px] rounded"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
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
                Slanje...
              </span>
              <span v-else>Pošalji upit</span>
            </button>
          </form>
        </div>

        <div class="w-full mx-auto md:max-w-[416px] mt-8 lg:mt-0">
          <div class="border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-medium mb-4">Sažetak rezervacije</h2>

            <div class="mb-4" v-if="currentCompleteSmjestaj">
              <img
                :src="
                  getSlikaUrl(currentCompleteSmjestaj.thumbnail) ||
                  '/placeholder-image.jpg'
                "
                :alt="currentCompleteSmjestaj.naziv"
                class="w-full h-auto object-cover rounded"
              />
            </div>

            <div
              class="flex items-center mb-2"
              v-if="currentCompleteSmjestaj?.broj_zvjezdica"
            >
              <div class="flex text-yellow-400">
                <span
                  v-for="i in currentCompleteSmjestaj.broj_zvjezdica"
                  :key="'star-' + i"
                  >★</span
                >
              </div>
            </div>

            <h3 class="text-xl font-medium mb-2" v-if="currentCompleteSmjestaj">
              {{ currentCompleteSmjestaj.naziv }}
            </h3>

            <div class="flex items-start mb-4" v-if="currentCompleteSmjestaj">
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
              <span class="ml-2 text-gray-600">
                {{ currentCompleteSmjestaj.adresa }},
                {{ currentCompleteSmjestaj.postanski_broj || "" }},
                {{ currentCompleteSmjestaj.grad }}
              </span>
            </div>

            <div class="pt-4">
              <div class="flex gap-2 mb-4">
                <!-- Datum prijave column -->
                <div class="flex flex-col">
                  <div class="text-sm text-gray-100 font-bold mb-2">
                    Datum prijave
                  </div>
                  <div class="font-normal text-sm text-gray-80">
                    {{ formatDate(checkin) }}
                  </div>
                </div>

                <!-- Datum odjave column -->
                <div class="flex flex-col">
                  <div class="text-sm text-gray-100 font-bold mb-2">
                    Datum odjave
                  </div>
                  <div class="font-normal text-sm text-gray-80">
                    {{ formatDate(checkout) }}
                  </div>
                </div>

                <div class="flex flex-col">
                  <div class="text-sm text-gray-100 font-bold mb-2">Gosti</div>
                  <div class="font-normal text-sm text-gray-80">
                    {{ adults }} odrasli{{ adults !== 1 ? "h" : ""
                    }}{{ children > 0 ? `, ${children} djece` : "" }}
                  </div>
                </div>

                <div class="flex flex-col">
                  <div class="text-sm text-gray-100 font-bold mb-2">
                    Noćenja
                  </div>
                  <div class="font-normal text-sm text-gray-80">
                    {{ nightsCount }} noćenje{{ nightsCount !== 1 ? "a" : "" }}
                  </div>
                </div>
              </div>

              <div
                v-if="
                  currentCompleteSmjestaj?.check_in ||
                  currentCompleteSmjestaj?.check_out
                "
                class="text-sm mt-1 mb-2"
              ></div>
            </div>

            <div class="pt-4" v-if="currentCompleteSmjestaj?.cijena_nocenja">
              <div class="mt-3 pt-3">
                <div class="font-medium">Ukupna cijena</div>
                <div class="text-lg font-bold">{{ getTotalPrice() }} EUR</div>
                <div class="text-sm text-gray-500">
                  {{ getTotalPriceHRK() }} HRK
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { FormData } from "~/types/pages/form-data";
import type { UpitFormData } from "~/types/directus/exports/upit";

definePageMeta({
  middleware: ["auth"],
});

export default defineComponent({
  name: "UpitPage",

  setup() {
    const route = useRoute();
    const slug = computed<string>(() => route.params.slug as string);
    const checkin = computed<string>(
      () => (route.query.checkin as string) || ""
    );
    const checkout = computed<string>(
      () => (route.query.checkout as string) || ""
    );
    const adults = computed<number>(() => Number(route.query.adults) || 2);
    const children = computed<number>(() => Number(route.query.children) || 0);

    const authStore = useAuthStore();

    const user = computed(() => authStore.user);

    const smjestajiComposable = useSmjestaji();
    const {
      currentCompleteSmjestaj,
      fetchCompleteSmjestajBySlug,
      isLoading,
      error,
      formatPriceHRK,
    } = smjestajiComposable;

    const upitiComposable = useUpiti();
    const { submitUpit, isSubmitting } = upitiComposable;

    const form = ref<FormData>({
      ime: "",
      prezime: "",
      email: "",
      telefon: "",
      drzava: "",
      poruka: "",
    });

    const nightsCount = computed<number>(() => {
      if (!checkin.value || !checkout.value) return 1;

      try {
        const checkinParts = checkin.value.split(".");
        const checkoutParts = checkout.value.split(".");

        if (checkinParts.length < 3 || checkoutParts.length < 3) return 1;

        const checkinDate = new Date(
          parseInt(checkinParts[2]),
          parseInt(checkinParts[1]) - 1,
          parseInt(checkinParts[0])
        );

        const checkoutDate = new Date(
          parseInt(checkoutParts[2]),
          parseInt(checkoutParts[1]) - 1,
          parseInt(checkoutParts[0])
        );

        const diffTime = checkoutDate.getTime() - checkinDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 1;
      } catch (e) {
        console.error("Error calculating nights:", e);
        return 1;
      }
    });

    const formatDate = (dateString: string): string => {
      if (!dateString) return "";

      if (dateString.includes(".")) {
        const parts = dateString.split(".");
        if (parts.length >= 3) {
          return `${parts[0]}.${parts[1]}.${parts[2]}`;
        }
      }

      return dateString;
    };

    const submitForm = async (): Promise<void> => {
      try {
        if (!currentCompleteSmjestaj.value) {
          throw new Error("Detalji smještaja nisu dostupni");
        }

        const upitData: UpitFormData = {
          smjestaj_id: currentCompleteSmjestaj.value.id,
          ime: form.value.ime,
          prezime: form.value.prezime,
          email: form.value.email,
          telefon: form.value.telefon,
          poruka: form.value.poruka,
          drzava: form.value.drzava,
          datum_od: formatDate(checkin.value),
          datum_do: formatDate(checkout.value),
          broj_odraslih: adults.value,
          broj_djece: children.value,
          korisnik_id: "",
        };

        if (authStore.isAuthenticated && authStore.user) {
          upitData.korisnik_id = authStore.user.id;
        }

        console.log("Slanje upita:", upitData);

        const result = await submitUpit(upitData);

        if (result.success) {
          navigateTo("/message/thank-you");
        } else {
          throw new Error(result.error || "Greška prilikom slanja upita");
        }
      } catch (error: any) {
        console.error("Error submitting inquiry:", error);
        alert(
          `Greška prilikom slanja upita: ${
            error.message || "Molimo pokušajte ponovno kasnije."
          }`
        );
      }
    };

    const prefillUserData = (): void => {
      if (authStore.isAuthenticated && authStore.user) {
        form.value = {
          ...form.value,
          ime: authStore.user.first_name || "",
          prezime: authStore.user.last_name || "",
          email: authStore.user.email || "",
          telefon: authStore.user.telefon || "",
        };
      }
    };

    onMounted(async () => {
      if (slug.value) {
        await fetchCompleteSmjestajBySlug(slug.value);
      }

      if (authStore.isAuthenticated && !authStore.user) {
        await authStore.fetchCurrentUser();
      }

      prefillUserData();
    });

    const getTotalPrice = (): string => {
      if (!currentCompleteSmjestaj.value?.cijena_nocenja) return "0.00";

      const roomPrice =
        currentCompleteSmjestaj.value.cijena_nocenja * nightsCount.value;
      const touristTax = currentCompleteSmjestaj.value.boravisna_pristojba
        ? (currentCompleteSmjestaj.value.boravisna_pristojba *
            nightsCount.value *
            adults.value) /
          7.5345
        : 0;

      return (roomPrice + touristTax).toFixed(2);
    };

    const getTotalPriceHRK = (): string => {
      if (!currentCompleteSmjestaj.value?.cijena_nocenja) return "0.00";

      const roomPrice =
        currentCompleteSmjestaj.value.cijena_nocenja * nightsCount.value;
      const touristTax = currentCompleteSmjestaj.value.boravisna_pristojba
        ? currentCompleteSmjestaj.value.boravisna_pristojba *
          nightsCount.value *
          adults.value
        : 0;

      const totalHRK = roomPrice * 7.5345 + touristTax;
      return totalHRK.toFixed(2);
    };

    return {
      isLoading,
      error,
      currentCompleteSmjestaj,
      form,
      isSubmitting,

      slug,
      checkin,
      checkout,
      adults,
      children,
      nightsCount,

      formatDate,
      formatTime: smjestajiComposable.formatTime,
      getSlikaUrl: smjestajiComposable.getSlikaUrl,
      submitForm,
      formatPriceHRK,
      getTotalPrice,
      getTotalPriceHRK,
      user,
    };
  },
});
</script>
