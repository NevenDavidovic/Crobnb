<template>
  <div class="w-full z-10 relative py-4 max-w-1200 mx-auto px-4">
    <div class="bg-white rounded-lg md:p-6 md:shadow-md">
      <div class="flex flex-col md:flex-row items-end gap-4">
        <div class="flex-1 w-full">
          <label class="block text-sm font-medium text-gray-80 mb-3"
            >Lokacije</label
          >
          <div class="relative w-full">
            <select
              class="text-sm appearance-none pl-10 pr-8 py-2 h-12 w-full border border-gray-300 rounded-lg text-gray-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="selectedLocation"
            >
              <option value="sredisnja-dalmacija">Središnja Dalmacija</option>
              <option value="split">Split i okolica</option>
              <option value="omis">Omiš i okolica</option>
              <option value="makarska">Makarska i okolica</option>
            </select>
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
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
        </div>

        <div class="flex-1 w-full">
          <label class="block text-sm font-medium text-gray-80 mb-3"
            >Tip smještaja</label
          >
          <div class="relative w-full">
            <select
              class="text-sm appearance-none pl-10 pr-8 py-2 h-12 w-full border border-gray-300 rounded-lg text-gray-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="selectedAccommodationType"
              :disabled="tipoviLoading"
            >
              <option v-if="tipoviLoading" value="">Loading...</option>
              <option v-else-if="tipoviError" value="">
                Error loading data
              </option>
              <option v-else-if="tipovi.length === 0" value="">
                No accommodation types
              </option>
              <option
                v-for="tip in tipovi"
                :key="tip.id"
                :value="tip.slug || tip.id"
              >
                {{ tip.naziv }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 20V14.4C1.00265 13.5521 1.36009 12.7396 1.99426 12.14C2.62842 11.5405 3.48777 11.2025 4.38462 11.2H19.6154C20.5122 11.2025 21.3716 11.5405 22.0057 12.14C22.6399 12.7396 22.9973 13.5521 23 14.4V20M18.7692 11.2H3.53846V6C3.54014 5.47005 3.76354 4.96226 4.15989 4.58753C4.55624 4.2128 5.09333 4.00158 5.65385 4H18.3462C18.9067 4.00158 19.4438 4.2128 19.8401 4.58753C20.2365 4.96226 20.4599 5.47005 20.4615 6V11.2H18.7692Z"
                  stroke="#337589"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1 21V20.5357C1.00098 20.1666 1.13501 19.813 1.37283 19.552C1.61064 19.291 1.93291 19.1439 2.26923 19.1429H21.7308C22.0671 19.1439 22.3894 19.291 22.6272 19.552C22.865 19.813 22.999 20.1666 23 20.5357V21M4.38462 10.7857V9.85714C4.38587 9.36502 4.56457 8.89345 4.88167 8.54547C5.19877 8.19748 5.62848 8.00138 6.07692 8H10.3077C10.7561 8.00138 11.1858 8.19748 11.5029 8.54547C11.82 8.89345 11.9987 9.36502 12 9.85714M12 9.85714V10.7857M12 9.85714C12.0013 9.36502 12.18 8.89345 12.4971 8.54547C12.8141 8.19748 13.2439 8.00138 13.6923 8H17.9231C18.3715 8.00138 18.8012 8.19748 19.1183 8.54547C19.4354 8.89345 19.6141 9.36502 19.6154 9.85714V10.7857"
                  stroke="#337589"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
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
        </div>

        <!-- Date filter -->
        <div class="flex-1 w-full">
          <label class="block text-sm font-medium text-gray-80 mb-3"
            >Datum prijave / odjave</label
          >
          <div class="relative w-full">
            <div
              @click="showCalendar = !showCalendar"
              class="text-sm appearance-none pl-10 pr-8 py-2 h-12 w-full border border-gray-300 rounded-lg text-gray-60 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center"
            >
              {{ dateRange }}
            </div>
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16 2V6"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 2V6"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 10H21"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
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

            <!-- Calendar dropdown -->
            <div
              v-if="showCalendar"
              class="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <button
                    class="text-gray-500 hover:text-gray-700"
                    @click="prevMonth"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="#BEC0C5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <div class="text-gray-800 font-medium">Ožujak 2023</div>
                  <button
                    class="text-gray-500 hover:text-gray-700"
                    @click="nextMonth"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="#BEC0C5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  class="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2"
                >
                  <div>PON</div>
                  <div>UTO</div>
                  <div>SRI</div>
                  <div>ČET</div>
                  <div>PET</div>
                  <div>SUB</div>
                  <div>NED</div>
                </div>

                <div class="grid grid-cols-7 gap-2 text-center">
                  <div></div>
                  <div></div>
                  <div class="py-1">1</div>
                  <div class="py-1 bg-teal-500 text-white rounded-full">2</div>
                  <div class="py-1 bg-teal-500 text-white rounded-full">3</div>
                  <div class="py-1">4</div>
                  <div class="py-1">5</div>

                  <div class="py-1">6</div>
                  <div class="py-1">7</div>
                  <div class="py-1">8</div>
                  <div class="py-1">9</div>
                  <div class="py-1">10</div>
                  <div class="py-1">11</div>
                  <div class="py-1">12</div>

                  <div class="py-1">13</div>
                  <div class="py-1">14</div>
                  <div class="py-1">15</div>
                  <div class="py-1">16</div>
                  <div class="py-1">17</div>
                  <div class="py-1">18</div>
                  <div class="py-1">19</div>

                  <div class="py-1">20</div>
                  <div class="py-1">21</div>
                  <div class="py-1">22</div>
                  <div class="py-1">23</div>
                  <div class="py-1">24</div>
                  <div class="py-1">25</div>
                  <div class="py-1">26</div>

                  <div class="py-1">27</div>
                  <div class="py-1">28</div>
                  <div class="py-1">29</div>
                  <div class="py-1">30</div>
                  <div class="py-1">31</div>
                  <div></div>
                  <div></div>
                </div>

                <div class="mt-4 flex justify-end">
                  <button
                    @click="confirmDateSelection"
                    class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm"
                  >
                    Potvrdi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Guests filter -->
        <div class="flex-1 w-full">
          <label class="block text-sm font-medium text-gray-700 mb-3"
            >Broj gostiju</label
          >
          <div class="relative w-full">
            <div
              @click="showGuestsDropdown = !showGuestsDropdown"
              class="text-sm appearance-none pl-10 pr-8 py-2 h-12 w-full border border-gray-300 rounded-lg text-gray-60 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center"
            >
              {{ adultCount }} odraslih, {{ childrenCount }} djece
            </div>
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="#337589"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
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

            <!-- Guests dropdown -->
            <div
              v-if="showGuestsDropdown"
              class="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            >
              <div class="p-4">
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-700">Odrasli</span>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="decrementAdults"
                        class="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="white"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                      <span class="w-6 text-center">{{ adultCount }}</span>
                      <button
                        @click="incrementAdults"
                        class="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="white"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-700">Djeca</span>
                    <div class="flex items-center space-x-2">
                      <button
                        @click="decrementChildren"
                        class="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="white"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                      <span class="w-6 text-center">{{ childrenCount }}</span>
                      <button
                        @click="incrementChildren"
                        class="w-8 h-8 flex items-center justify-center bg-teal-600 text-white rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="white"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-4 flex justify-end">
                  <button
                    @click="confirmGuestSelection"
                    class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm"
                  >
                    Potvrdi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 w-full md:w-auto">
          <button
            class="w-full md:w-auto md:col-span-auto bg-primary-80 text-white h-12 py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <div class="flex justify-center items-center text-base">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21 21L16.65 16.65"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              Traži
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tipovi: {
      type: Array,
      default: () => [],
    },
    tipoviLoading: {
      type: Boolean,
      default: false,
    },
    tipoviError: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    // Location
    const selectedLocation = ref("sredisnja-dalmacija");

    // Accommodation type
    const selectedAccommodationType = ref("hoteli");

    // Calendar
    const showCalendar = ref(false);
    const dateRange = ref("02.03.2023. - 03.03.2023.");

    const prevMonth = () => {
      // Logic for previous month
    };

    const nextMonth = () => {
      // Logic for next month
    };

    const confirmDateSelection = () => {
      showCalendar.value = false;
    };

    // Guests
    const showGuestsDropdown = ref(false);
    const adultCount = ref(2);
    const childrenCount = ref(0);

    const incrementAdults = () => {
      adultCount.value++;
    };

    const decrementAdults = () => {
      if (adultCount.value > 0) {
        adultCount.value--;
      }
    };

    const incrementChildren = () => {
      childrenCount.value++;
    };

    const decrementChildren = () => {
      if (childrenCount.value > 0) {
        childrenCount.value--;
      }
    };

    const confirmGuestSelection = () => {
      showGuestsDropdown.value = false;
    };

    watch(
      () => props.tipovi,
      (newTipovi) => {
        if (
          newTipovi &&
          newTipovi.length > 0 &&
          !selectedAccommodationType.value
        ) {
          selectedAccommodationType.value =
            newTipovi[0].slug || newTipovi[0].id.toString();
        }
      },
      { immediate: true }
    );

    return {
      selectedLocation,
      selectedAccommodationType,
      showCalendar,
      dateRange,
      prevMonth,
      nextMonth,
      confirmDateSelection,
      showGuestsDropdown,
      adultCount,
      childrenCount,
      incrementAdults,
      decrementAdults,
      incrementChildren,
      decrementChildren,
      confirmGuestSelection,
    };
  },
};
</script>
