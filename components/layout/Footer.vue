<template>
  <footer class="bg-primary-5 py-10 border-t border-gray-40">
    <div
      class="flex md:flex-row flex-col-reverse justify-between max-w-1200 mx-auto px-4"
    >
      <div
        class="flex md:flex-row flex-col gap-[46px] items-center md:items-start"
      >
        <div>
          <h3
            class="font-medium text-xl text-black mb-4 text-center md:text-left"
          >
            Crobnb.hr
          </h3>
          <div
            class="text-base text-center md:text-left text-gray-100 space-y-2"
          >
            <p>info@crobnb.hr</p>
            <p>01 2377 654</p>
          </div>
        </div>

        <div>
          <h3
            class="font-medium text-black mb-4 text-xl text-center md:text-left"
          >
            Tipovi smještaja
          </h3>
          <ul
            class="text-base text-gray-100 space-y-2 text-center md:text-left"
          >
            <li v-for="(type, index) in accommodationTypes" :key="index">
              <NuxtLink
                :to="type.link"
                class="hover:text-teal-600 transition-colors"
              >
                {{ type.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3
            class="font-medium text-black mb-4 text-xl text-center md:text-left"
          >
            Regije
          </h3>
          <ul
            class="text-base text-gray-100 space-y-2 text-center md:text-left"
          >
            <li v-for="(region, index) in regions" :key="index">
              <NuxtLink
                :to="region.link"
                class="hover:text-teal-600 transition-colors"
              >
                {{ region.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3
            class="font-medium text-black mb-4 text-xl text-center md:text-left"
          >
            Prati nas
          </h3>
          <div class="flex space-x-4 text-[#00526C]">
            <a href="#" class="hover:text-teal-600 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <a href="#" class="hover:text-teal-600 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 2.9998C22.0424 3.67528 20.9821 4.19191 19.86 4.5298C19.2577 3.83731 18.4573 3.34649 17.567 3.12373C16.6767 2.90096 15.7395 2.957 14.8821 3.28426C14.0247 3.61151 13.2884 4.1942 12.773 4.95352C12.2575 5.71283 11.9877 6.61214 12 7.5298V8.5298C10.2426 8.57537 8.50127 8.18561 6.93101 7.39525C5.36074 6.60488 4.01032 5.43844 3 3.9998C3 3.9998 -1 12.9998 8 16.9998C5.94053 18.3978 3.48716 19.0987 1 18.9998C10 23.9998 21 18.9998 21 7.4998C20.9991 7.22126 20.9723 6.9434 20.92 6.6698C21.9406 5.6633 22.6608 4.39251 23 2.9998Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <a href="#" class="hover:text-teal-600 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.9997 11.3698C16.1231 12.2021 15.981 13.052 15.5935 13.7988C15.206 14.5456 14.5929 15.1512 13.8413 15.5295C13.0898 15.9077 12.2382 16.0394 11.4075 15.9057C10.5768 15.7721 9.80947 15.3799 9.21455 14.785C8.61962 14.1901 8.22744 13.4227 8.09377 12.592C7.96011 11.7614 8.09177 10.9097 8.47003 10.1582C8.84829 9.40667 9.45389 8.79355 10.2007 8.40605C10.9475 8.01856 11.7975 7.8764 12.6297 7.99981C13.4786 8.1257 14.2646 8.52128 14.8714 9.12812C15.4782 9.73496 15.8738 10.5209 15.9997 11.3698Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17.5 6.5H17.51"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="flex items-center md:items-start justify-center">
        <button
          @click="scrollToTop"
          class="mb-6 p-2 border border-[#00526C] rounded-md text-[#00526C]"
        >
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div class="py-4 mt-8 border-t border-gray-40 bg-white">
      <div
        class="flex md:flex-row flex-col gap-4 md:justify-between items-center px-4 max-w-1344 mx-auto"
      >
        <p class="text-base text-[#070707]">
          © Crobnb {{ currentYear }}. All rights reserved
        </p>

        <img src="/images/logo.svg" alt="Crobnb" class="w-6 h-6" />
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import type { Regija, TipSmjestaja } from "~/types/directus/index";

export default defineComponent({
  name: "AppFooter",

  setup() {
    const { regije, fetchRegije } = useRegije();
    const { tipovi, fetchTipovi } = useTipoviSmjestaja();

    onMounted(async () => {
      await Promise.all([fetchRegije(), fetchTipovi()]);
    });

    const accommodationTypes = computed(() => {
      const today = new Date();

      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}.`;
      };

      const todayFormatted = formatDate(today);
      const tomorrowFormatted = formatDate(tomorrow);

      return tipovi.value.map((tip: TipSmjestaja) => ({
        label: tip.naziv,
        link: `/smjestaji?location=sve&type=${tip.slug}&checkin=${todayFormatted}&checkout=${tomorrowFormatted}`,
      }));
    });

    const regions = computed(() => {
      return regije.value.map((regija: Regija) => ({
        label: regija.naziv,
        link: `/regija/${regija.slug}`,
      }));
    });

    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const scrollToBottom = () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    };

    return {
      accommodationTypes,
      regions,
      currentYear,
      scrollToTop,
      scrollToBottom,
      isLoadingRegije: computed(() => regije.value.length === 0),
      isLoadingTipovi: computed(() => tipovi.value.length === 0),
    };
  },
});
</script>
