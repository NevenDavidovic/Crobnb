<template>
  <div class="flex flex-col mt-10">
    <div class="max-w-1200 px-4 mx-auto mb-10">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="text-gray-500">Loading accommodation details...</div>
      </div>

      <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-red-600 mb-6">
        {{ error }}
      </div>

      <div v-else-if="!currentCompleteSmjestaj" class="text-center py-12">
        <p class="text-gray-600">
          Accommodation not found. Please check the URL or try again later.
        </p>
      </div>

      <div v-else class="max-w-1200 mx-auto py:4 md:py-8 px-4 lg:px-0">
        <div class="flex flex-col">
          <div class="flex md:hidden justify-between py-4">
            <button @click="navigateToSmjestaji">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5"
                  stroke="#202532"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 19L5 12L12 5"
                  stroke="#00526C"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              class="flex items-center text-primary-100 hover:text-primary-80"
              @click="toggleFavorite(currentCompleteSmjestaj.id)"
            >
              <span class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :fill="
                    isFavorite(currentCompleteSmjestaj.id) ? '#337589' : 'none'
                  "
                  viewBox="0 0 24 24"
                  stroke="#337589"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </span>
              <span class="text-base text-gray-80">Dodaj u favorite</span>
            </button>
          </div>
          <div>
            <div class="block md:hidden mb-20 relative">
              <div class="relative overflow-hidden">
                <div
                  class="flex transition-transform duration-300 ease-in-out"
                  :style="`transform: translateX(-${
                    currentMobileSlide * 100
                  }%)`"
                >
                  <div
                    v-for="(slika, index) in getGalleryImages()"
                    :key="index"
                    class="w-full flex-shrink-0 relative"
                  >
                    <img
                      :src="slika || '/placeholder-apartment.jpg'"
                      :alt="`${currentCompleteSmjestaj.naziv} - image ${
                        index + 1
                      }`"
                      class="w-full h-64 object-cover rounded-md cursor-pointer"
                      @click="openGallery(index)"
                    />

                    <div
                      v-if="index === 3 && getTotalImagesCount() > 4"
                      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md cursor-pointer"
                      @click="openGallery(index)"
                    >
                      <span class="text-white text-lg font-medium"
                        >+ {{ getTotalImagesCount() - 4 }} fotografija</span
                      >
                    </div>
                  </div>
                </div>

                <button
                  v-if="currentMobileSlide > 0"
                  @click="prevMobileSlide"
                  class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-lg p-2 z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  v-if="
                    currentMobileSlide < Math.min(getTotalImagesCount(), 4) - 1
                  "
                  @click="nextMobileSlide"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-lg p-2 z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div class="uppercase text-gray-80 text-base mb-2">
              {{ currentCompleteSmjestaj.tip_smjestaja?.naziv || "" }}
            </div>

            <div class="flex justify-between items-start mb-4">
              <h1
                class="text-4xl font-bold text-gray-800 flex md:flex-row flex-col-reverse gap-2"
              >
                {{ currentCompleteSmjestaj.naziv }}
                <span class="text-yellow-400 lg:ml-2">
                  <span
                    v-for="i in Number(
                      currentCompleteSmjestaj.broj_zvjezdica || 0
                    )"
                    :key="i"
                    >★</span
                  >
                </span>
              </h1>
            </div>

            <div
              class="flex items-center items-end justify-between text-primary-80 mb-6 underline"
            >
              <div class="flex items-center">
                <span class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#337589"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                {{ currentCompleteSmjestaj.adresa }},
                {{ currentCompleteSmjestaj.postanski_broj }},
                {{ currentCompleteSmjestaj.grad }}
              </div>

              <button
                class="flex items-center md:flex hidden text-primary-100 hover:text-primary-80"
                @click="toggleFavorite(currentCompleteSmjestaj.id)"
              >
                <span class="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :fill="
                      isFavorite(currentCompleteSmjestaj.id)
                        ? '#337589'
                        : 'none'
                    "
                    viewBox="0 0 24 24"
                    stroke="#337589"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </span>
                <span class="text-base hidden md:block text-gray-80"
                  >Dodaj u favorite</span
                >
              </button>
            </div>
          </div>
        </div>
        <!-- Photo Gallery -->
        <div>
          <!-- Desktop Grid Layout (hidden on mobile) -->
          <div class="hidden md:grid grid-cols-4 gap-4 mb-20">
            <div class="col-span-2 row-span-2">
              <img
                :src="getMainImageUrl() || '/placeholder-apartment.jpg'"
                :alt="currentCompleteSmjestaj.naziv"
                class="w-full h-full object-cover rounded-md cursor-pointer"
                @click="openGallery(0)"
              />
            </div>
            <div
              v-for="(slika, index) in getGalleryImages().slice(0, 3)"
              :key="index"
              class="col-span-1"
            >
              <img
                :src="slika || '/placeholder-apartment.jpg'"
                :alt="`${currentCompleteSmjestaj.naziv} - image ${index + 1}`"
                class="w-full h-full object-cover rounded-md cursor-pointer"
                @click="openGallery(index + 1)"
              />
            </div>
            <div class="col-span-1 relative">
              <img
                :src="
                  getGalleryImages()[3] ||
                  getMainImageUrl() ||
                  '/placeholder-apartment.jpg'
                "
                :alt="`${currentCompleteSmjestaj.naziv} - image 4`"
                class="w-full h-full object-cover rounded-md cursor-pointer"
                @click="openGallery(3)"
              />
              <div
                v-if="getTotalImagesCount() > 4"
                class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md cursor-pointer"
                @click="openGallery(3)"
              >
                <span class="text-white text-lg font-medium"
                  >+ {{ getTotalImagesCount() - 4 }} fotografija</span
                >
              </div>
            </div>
          </div>
        </div>

        <Teleport to="body">
          <Transition name="fade">
            <div
              v-if="isGalleryOpen"
              class="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
              @click="closeGallery"
            >
              <div class="relative w-full max-w-5xl max-h-[90vh]" @click.stop>
                <!-- Image Container with Arrows and Counter -->
                <div class="relative flex flex-col items-center">
                  <!-- Close Button - Fixed to top right -->
                  <button
                    class="text-white p-2 hover:bg-opacity-70 transition-all z-10 text-right w-full px-[95px] max-w-1200 flex justify-end"
                    @click="closeGallery"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  <!-- Navigation Buttons - Aligned with Image -->
                  <div class="relative w-full">
                    <button
                      v-if="galleryImages.length > 1"
                      class="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-lg p-2 hover:bg-opacity-70 transition-all z-10"
                      @click.stop="prevImage"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>

                    <!-- Image Display -->
                    <img
                      :key="currentImageIndex"
                      :src="galleryImages[currentImageIndex]"
                      :alt="`${currentCompleteSmjestaj.naziv} - image ${
                        currentImageIndex + 1
                      }`"
                      class="max-h-[85vh] max-w-1200 px-16 mx-auto object-contain rounded w-full"
                    />

                    <button
                      v-if="galleryImages.length > 1"
                      class="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-lg p-2 hover:bg-opacity-70 transition-all z-10"
                      @click.stop="nextImage"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                  <div
                    v-if="galleryImages.length > 1"
                    class="text-white px-4 py-2 text-sm font-medium z-20 text-lg mx-auto text-right px-[95px] max-w-1200 px-4 w-full"
                  >
                    {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <div class="flex lg:flex-row flex-col-reverse gap-20">
          <div class="max-w-[660px] w-full">
            <h2 class="text-[32px] font-bold mb-4">Detalji</h2>

            <div
              class="prose max-w-none mb-6 text-[20px] text-gray-80"
              v-if="currentCompleteSmjestaj.details_opis"
              v-html="currentCompleteSmjestaj.details_opis"
            ></div>
            <div class="prose max-w-none mb-6" v-else>
              <p>Opis trenutno nije dostupan.</p>
            </div>

            <div
              class="prose max-w-none mb-8"
              v-if="!currentCompleteSmjestaj.details_opis"
            >
              <p>Opis trenutno nije dostupan</p>
            </div>

            <div class="mb-8">
              <div
                class="text-gray-80 text-[20px] mb-1"
                v-if="currentCompleteSmjestaj.check_in"
              >
                Check in: {{ formatTime(currentCompleteSmjestaj.check_in) }}
              </div>
              <div
                class="text-gray-80 text-[20px] mb-1"
                v-if="currentCompleteSmjestaj.check_out"
              >
                Check out: {{ formatTime(currentCompleteSmjestaj.check_out) }}
              </div>
            </div>

            <div class="flex gap-4 mb-8">
              <div
                class="border rounded-lg p-4 flex flex-col items-center justify-center max-w-[140px] w-full"
              >
                <div class="flex justify-center mb-2">
                  <div
                    v-for="n in currentCompleteSmjestaj.max_broj_gostiju"
                    :key="n"
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
                        stroke="#838791"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="#838791"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="text-sm text-center">
                  max. {{ currentCompleteSmjestaj.max_broj_gostiju }}
                  {{
                    currentCompleteSmjestaj.max_broj_gostiju === 1
                      ? "osoba"
                      : "osobe"
                  }}
                </div>
              </div>

              <div
                class="border rounded-lg p-4 flex flex-col items-center justify-center max-w-[140px] w-full"
              >
                <div class="flex justify-center mb-2">
                  <div
                    v-for="n in currentCompleteSmjestaj.broj_kreveta"
                    :key="n"
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
                        stroke="#838791"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 21V20.5357C1.00098 20.1666 1.13501 19.813 1.37283 19.552C1.61064 19.291 1.93291 19.1439 2.26923 19.1429H21.7308C22.0671 19.1439 22.3894 19.291 22.6272 19.552C22.865 19.813 22.999 20.1666 23 20.5357V21M4.38462 10.7857V9.85714C4.38587 9.36502 4.56457 8.89345 4.88167 8.54547C5.19877 8.19748 5.62848 8.00138 6.07692 8H10.3077C10.7561 8.00138 11.1858 8.19748 11.5029 8.54547C11.82 8.89345 11.9987 9.36502 12 9.85714M12 9.85714V10.7857M12 9.85714C12.0013 9.36502 12.18 8.89345 12.4971 8.54547C12.8141 8.19748 13.2439 8.00138 13.6923 8H17.9231C18.3715 8.00138 18.8012 8.19748 19.1183 8.54547C19.4354 8.89345 19.6141 9.36502 19.6154 9.85714V10.7857"
                        stroke="#838791"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="text-sm text-center">
                  {{ currentCompleteSmjestaj.broj_kreveta }}
                  {{
                    currentCompleteSmjestaj.broj_kreveta === 1
                      ? "krevet"
                      : "kreveta"
                  }}
                </div>
              </div>

              <div
                class="border rounded-lg p-4 flex flex-col items-center justify-center max-w-[140px] w-full"
              >
                <div class="flex justify-center mb-2">
                  <div
                    v-for="n in currentCompleteSmjestaj.broj_kupaonica"
                    :key="n"
                  >
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.5 9.5H20H22.25C22.5152 9.5 22.7696 9.60536 22.9571 9.79289L23.3107 9.43934L22.9571 9.79289C23.1446 9.98043 23.25 10.2348 23.25 10.5V13.5C23.25 14.7598 22.7496 15.968 21.8588 16.8588C20.968 17.7496 19.7598 18.25 18.5 18.25H18V18.75V20.25C18 20.3163 17.9737 20.3799 17.9268 20.4268C17.8799 20.4737 17.8163 20.5 17.75 20.5C17.6837 20.5 17.6201 20.4737 17.5732 20.4268C17.5263 20.3799 17.5 20.3163 17.5 20.25V18.75V18.25H17H8H7.5V18.75V20.25C7.5 20.3163 7.47366 20.3799 7.42678 20.4268C7.37989 20.4737 7.3163 20.5 7.25 20.5C7.1837 20.5 7.12011 20.4737 7.07322 20.4268C7.02634 20.3799 7 20.3163 7 20.25V18.75V18.25H6.5C5.24022 18.25 4.03204 17.7496 3.14124 16.8588C2.25044 15.968 1.75 14.7598 1.75 13.5V10.5C1.75 10.2348 1.85536 9.98043 2.04289 9.79289C2.23043 9.60536 2.48478 9.5 2.75 9.5H5H5.5V9V4.875C5.5 4.31141 5.72388 3.77091 6.1224 3.3724C6.52091 2.97388 7.06142 2.75 7.625 2.75C8.18858 2.75 8.72909 2.97388 9.1276 3.3724C9.52612 3.77091 9.75 4.31141 9.75 4.875C9.75 4.9413 9.72366 5.00489 9.67678 5.05178C9.62989 5.09866 9.5663 5.125 9.5 5.125C9.4337 5.125 9.37011 5.09866 9.32322 5.05178L8.96967 5.40533L9.32322 5.05178C9.27634 5.00489 9.25 4.9413 9.25 4.875C9.25 4.44402 9.07879 4.0307 8.77405 3.72595C8.4693 3.4212 8.05598 3.25 7.625 3.25C7.19402 3.25 6.7807 3.4212 6.47595 3.72595C6.17121 4.0307 6 4.44402 6 4.875V9V9.5H6.5H12.5H13V9C13 8.93369 13.0263 8.87011 13.0732 8.82322C13.1201 8.77634 13.1837 8.75 13.25 8.75H19.25C19.3163 8.75 19.3799 8.77634 19.4268 8.82322C19.4737 8.87011 19.5 8.9337 19.5 9V9.5ZM19 9.25H18.5H14H13.5V9.75V12.75V13.25H14H18.5H19V12.75V9.75V9.25ZM2.75 10H2.25V10.5V13.5C2.25 14.6272 2.69777 15.7082 3.4948 16.5052C4.29183 17.3022 5.37283 17.75 6.5 17.75H18.5C19.0581 17.75 19.6108 17.6401 20.1264 17.4265C20.642 17.2129 21.1106 16.8999 21.5052 16.5052C21.8999 16.1106 22.2129 15.642 22.4265 15.1264C22.6401 14.6108 22.75 14.0581 22.75 13.5V10.5V10H22.25H20H19.5V10.5V13.5C19.5 13.5663 19.4737 13.6299 19.4268 13.6768C19.3799 13.7237 19.3163 13.75 19.25 13.75H13.25C13.1837 13.75 13.1201 13.7237 13.0732 13.6768C13.0263 13.6299 13 13.5663 13 13.5V10.5V10H12.5H2.75Z"
                        fill="#202532"
                        stroke="#838791"
                      />
                    </svg>
                  </div>
                </div>
                <div class="text-sm text-center">
                  {{ currentCompleteSmjestaj.broj_kupaonica }}
                  kupaonica
                </div>
              </div>
            </div>
          </div>

          <SmjestajPaymentDetails
            :smjestaj="currentCompleteSmjestaj"
            :format-price="formatPrice"
            :format-price-h-r-k="formatPriceHRK"
            :selected-dates="selectedDates"
            :format-date="formatDate"
            @send-inquiry="handleSendInquiry"
          />
        </div>

        <!-- Amenities Section -->
        <div class="mt-12">
          <h2 class="text-[32px] font-bold mb-6">Sadržaji</h2>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="sadrzaj in getAmenities()"
              :key="sadrzaj.id"
              class="flex items-center"
            >
              <div
                v-if="
                  getSadrzajIconUrl &&
                  getSadrzajIconUrl(sadrzaj) &&
                  typeof sadrzaj.icon === 'object'
                "
              >
                <img
                  :src="getSadrzajIconUrl(sadrzaj) || undefined"
                  class="h-6 w-6 mr-3 object-contain text-lg text-gray-60"
                />
              </div>

              <div v-else-if="sadrzaj.icon && typeof sadrzaj.icon === 'string'">
                <span class="material-icons mr-3 text-2xl text-gray-40">
                  {{ sadrzaj.icon }}
                </span>
              </div>

              <div v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-3 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <span class="text-gray-80 text-[20px]">{{ sadrzaj.naziv }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-primary-5 py-16" v-if="currentCompleteSmjestaj?.grad">
      <h2 class="max-w-1200 mx-auto px-4 text-left text-[32px] font-bold mb-8">
        Još smještaja u {{ currentCompleteSmjestaj.grad }}
      </h2>

      <div v-if="loadingCitySmjestaji" class="flex justify-center">
        <div class="text-gray-500">Učitavanje smještaja...</div>
      </div>

      <div
        v-else-if="citySmjestajiError"
        class="bg-red-50 p-4 rounded-lg text-red-600 mb-6 max-w-1200 mx-auto px-4"
      >
        {{ citySmjestajiError }}
      </div>

      <div v-else-if="citySmjestaji.length === 0" class="text-center py-8">
        <p class="text-gray-100">
          Nema drugih smještaja u {{ currentCompleteSmjestaj.grad }}.
        </p>
      </div>

      <div v-else class="carousel-wrapper relative max-w-[1284px] px-4 mx-auto">
        <button
          @click="prevSlide"
          class="nav-arrow nav-prev left-0"
          v-show="showDesktopControls"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <ClientOnly>
          <swiper-container
            ref="swiperRef"
            :slides-per-view="1"
            :space-between="20"
            :pagination="false"
            :navigation="false"
            :breakpoints="{
              '640': {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              '768': {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              '1024': {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }"
            class="smjestaji-carousel px-4 lg:px-0 pb-[10px]"
          >
            <swiper-slide
              v-for="smjestaj in citySmjestaji"
              :key="smjestaj.id"
              class="pb-10 max-w-[80%] md:max-w-fit"
            >
              <div class="h-full w-fit">
                <SmjestajDetailCard
                  :item="{
                    imageUrl:
                      getThumbnailUrl(smjestaj) || '/placeholder-apartment.jpg',
                    name: smjestaj.naziv,
                    type: smjestaj.tip_smjestaja?.naziv || 'SMJEŠTAJ',
                    rating: smjestaj.broj_zvjezdica || 5,
                    price: smjestaj.cijena_nocenja,
                  }"
                  @click="goToDetail(smjestaj)"
                />
              </div>
            </swiper-slide>
          </swiper-container>

          <div class="fixed-pagination flex justify-center mt-4 space-x-2">
            <button
              v-for="i in 3"
              :key="i - 1"
              class="pagination-dot"
              :class="{ active: activeDot === i - 1 }"
              @click="goToGroup(i - 1)"
              type="button"
            ></button>
          </div>
        </ClientOnly>

        <Teleport to="body">
          <div
            v-if="showLoginModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="closeLoginModal"
          >
            <div
              class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden max-h-[440px] max-w-[574px] relative"
              @click.stop
            >
              <div class="flex justify-end items-center p-4 absolute right-0">
                <button
                  @click="closeLoginModal"
                  class="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div class="px-4">
                <PrijavaCard :redirect-url="inquiryLink" />
              </div>
            </div>
          </div>
        </Teleport>

        <button
          @click="nextSlide"
          class="nav-arrow nav-next right-0"
          v-show="showDesktopControls"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Favoriti } from "~/types/directus/index";

export default defineComponent({
  setup() {
    const accommodationDetail = useAccommodationDetail();
    const router = useRouter();
    const { addFavorite, removeFavorite, isFavorite, favorites } =
      useFavoriti();
    const authStore = useAuthStore();

    const toggleFavorite = async (id: number) => {
      try {
        if (!authStore.user) {
          router.push("/auth/prijava");
          return;
        }

        const smjestajId =
          accommodationDetail.currentCompleteSmjestaj.value?.id;
        if (!smjestajId) return;

        if (isFavorite(smjestajId)) {
          const favorite = favorites.value.find(
            (fav: Favoriti) => fav.smjestaj_id === smjestajId
          );

          if (favorite) {
            await removeFavorite(favorite.id);
          } else {
            console.warn(
              `No favorite record found for smjestaj ID: ${smjestajId}`
            );
          }
        } else {
          await addFavorite(smjestajId);
        }
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    };

    const closeLoginModal = () => {
      accommodationDetail.showLoginModal.value = false;
    };

    onMounted(() => {
      window.addEventListener("keydown", accommodationDetail.handleKeydown);
      accommodationDetail.setupAccommodation();
      accommodationDetail.setupWindowResizeListener();
      accommodationDetail.watchSlugChanges();
      accommodationDetail.watchSwiperChanges();
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", accommodationDetail.handleKeydown);

      if (accommodationDetail.swiperRef.value) {
        const swiperEl = accommodationDetail.swiperRef.value as any;
        if (swiperEl.removeEventListener) {
          swiperEl.removeEventListener(
            "slidechange",
            accommodationDetail.updateActiveDot
          );
        }
      }
    });

    const isFavoriteSmjestaj = computed(() => {
      const smjestajId = accommodationDetail.currentCompleteSmjestaj.value?.id;
      return smjestajId ? isFavorite(smjestajId) : false;
    });

    return {
      ...accommodationDetail,
      closeLoginModal,
      toggleFavorite,
      isFavoriteSmjestaj,
      isFavorite,
    };
  },
});
</script>

<style>
.carousel-wrapper {
  position: relative;
  padding: 0 40px;
}

.nav-arrow {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #337589;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-arrow:hover {
  background-color: #f8fafc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-prev {
  left: 0;
}

.nav-next {
  right: 0;
}

.smjestaji-carousel {
  padding-bottom: 10px;
}

.fixed-pagination {
  margin-top: 15px;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #cccccc;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-dot.active {
  background-color: #337589;
}

@media (max-width: 639px) {
  .fixed-pagination {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .carousel-wrapper {
    padding: 0;
  }
}
</style>
