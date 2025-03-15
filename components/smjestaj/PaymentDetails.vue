<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-5 py-10 px-5 max-w-full lg:max-w-[470px] h-fit w-full flex flex-col gap-[24px]"
  >
    <div
      class="flex justify-between items-center border-b border-gray-5 border-solid pb-[20px]"
    >
      <div>
        <div class="text-[32px] font-bold text-gray-100">
          {{ formatPrice(smjestaj.cijena_nocenja) }}
          <span class="text-gray-80 text-2xl"> / noć </span>
        </div>

        <div class="text-gray-80 text-[20px]">
          {{ formatPriceHRK(smjestaj.cijena_nocenja) }}
        </div>
      </div>
      <div class="flex items-center text-gray-60">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#BEC0C5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span>
          {{ smjestaj.max_broj_gostiju || 2 }}
          {{ (smjestaj.max_broj_gostiju || 2) === 1 ? "osoba" : "osobe" }}
        </span>
      </div>
    </div>

    <div>
      <div
        class="border border-gray-300 rounded p-3 flex items-center cursor-pointer"
        @click="toggleCalendar($event)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#337589"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-gray-700">
          {{ dateRange }}
        </span>

        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-60"
            viewBox="0 0 20 20"
            fill="#BEC0C5"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div
        v-if="showCalendar"
        class="absolute mt-1 bg-white border border-gray-40 rounded-lg shadow-lg z-50 !w-fit"
        @click.stop=""
      >
        <div class="p-4">
          <v-date-picker
            v-model="datePickerRange"
            :min-date="new Date()"
            color="teal"
            :masks="{
              input: 'DD.MM.YYYY.',
            }"
            locale="hr"
            is-range
          />

          <div class="mt-4 flex justify-end">
            <button
              @click="confirmDateSelection"
              class="bg-primary-80 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm"
            >
              Potvrdi
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6 flex flex-col gap-6">
      <div class="flex justify-between mb-2">
        <div>Apartman</div>
        <div class="flex flex-col gap-1">
          <span class="text-base text-gray-100 text-right font-medium">
            {{ formatPrice(smjestaj.cijena_nocenja) }}</span
          >
          <span class="text-sm text-gray-80 text-right">
            {{ formatPriceHRK(smjestaj.cijena_nocenja) }}</span
          >
        </div>
      </div>
      <div class="flex justify-between mb-2">
        <div>Boravišna pristojba</div>
        <div class="flex flex-col gap-1">
          <span class="text-base text-gray-100 text-right font-medium">
            {{ formatPrice(smjestaj.boravisna_pristojba) }}</span
          >
          <span class="text-sm text-gray-80 text-right">
            {{ formatPriceHRK(smjestaj.boravisna_pristojba) }}</span
          >
        </div>
      </div>
      <div class="border-t pt-2 mt-2 flex justify-between">
        <div>Ukupno</div>
        <div class="flex flex-col gap-1">
          <span class="text-base text-gray-100 text-right font-medium">{{
            formatPrice(smjestaj.cijena_nocenja + smjestaj.boravisna_pristojba)
          }}</span>
          <span class="text-sm font-normal text-gray-60 text-right">{{
            formatPriceHRK(
              smjestaj.cijena_nocenja + smjestaj.boravisna_pristojba
            )
          }}</span>
        </div>
      </div>
    </div>

    <button
      class="w-full bg-primary-80 hover:bg-primary-100 text-white font-medium py-3 px-4 rounded transition"
      @click="$emit('send-inquiry')"
    >
      Pošalji upit
    </button>
  </div>
</template>

<script lang="ts">
import type { SmjestajWithRelations } from "~/types/directus/index";
import type { DateRange } from "~/types/pages/date-range";
import type { SmjestajDetailsProps } from "~/types/pages/smjestaj-detail";

export default defineComponent({
  name: "SmjestajDetails",
  emits: ["send-inquiry"],
  props: {
    smjestaj: {
      type: Object as PropType<SmjestajWithRelations>,
      required: true,
    },
    formatPrice: {
      type: Function as PropType<(price: number) => string>,
      required: true,
    },
    formatPriceHRK: {
      type: Function as PropType<(price: number) => string>,
      required: true,
    },
    selectedDates: {
      type: Object as PropType<{
        checkin: Date;
        checkout: Date;
      }>,
      required: true,
    },
    formatDate: {
      type: Function as PropType<(date: Date) => string>,
      required: true,
    },
  },

  setup(props: SmjestajDetailsProps) {
    const route = useRoute();
    const router = useRouter();
    const showCalendar = ref(false);

    const parseDate = (dateStr: string): Date => {
      if (!dateStr) return new Date();

      const parts = dateStr.split(".");
      if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
      return new Date();
    };

    const formatLocalDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}.`;
    };

    const initializeDates = () => {
      const checkinParam = route.query.checkin as string;
      const checkoutParam = route.query.checkout as string;

      const today = props.selectedDates?.checkin || new Date();
      const tomorrow =
        props.selectedDates?.checkout ||
        new Date(new Date().setDate(new Date().getDate() + 1));

      return {
        start: checkinParam ? parseDate(checkinParam) : today,
        end: checkoutParam ? parseDate(checkoutParam) : tomorrow,
      };
    };

    const datePickerRange = ref<DateRange>(initializeDates());

    const dateRange = computed((): string => {
      if (datePickerRange.value?.start && datePickerRange.value?.end) {
        const start = formatLocalDate(datePickerRange.value.start);
        const end = formatLocalDate(datePickerRange.value.end);
        return `${start} - ${end}`;
      }
      return "Odaberite datume";
    });

    const toggleCalendar = (event: MouseEvent): void => {
      event.stopPropagation();
      showCalendar.value = !showCalendar.value;
    };

    const confirmDateSelection = (): void => {
      showCalendar.value = false;

      if (datePickerRange.value?.start && datePickerRange.value?.end) {
        const checkinFormatted = formatLocalDate(datePickerRange.value.start);
        const checkoutFormatted = formatLocalDate(datePickerRange.value.end);

        const query = { ...route.query };
        query.checkin = checkinFormatted;
        query.checkout = checkoutFormatted;

        router.replace({ query });
      }
    };

    onMounted(() => {
      document.addEventListener("click", () => {
        showCalendar.value = false;
      });
    });

    onUnmounted(() => {
      document.removeEventListener("click", () => {
        showCalendar.value = false;
      });
    });

    watch(
      () => route.query,
      (newQuery: Record<string, any>) => {
        if (newQuery.checkin || newQuery.checkout) {
          datePickerRange.value = {
            start: newQuery.checkin
              ? parseDate(
                  typeof newQuery.checkin === "string"
                    ? newQuery.checkin
                    : newQuery.checkin[0]
                )
              : datePickerRange.value.start,
            end: newQuery.checkout
              ? parseDate(
                  typeof newQuery.checkout === "string"
                    ? newQuery.checkout
                    : newQuery.checkout[0]
                )
              : datePickerRange.value.end,
          };
        }
      },
      { deep: true }
    );

    return {
      showCalendar,
      datePickerRange,
      dateRange,
      toggleCalendar,
      confirmDateSelection,
    };
  },
});
</script>
