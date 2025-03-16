<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-16">
      <p class="text-xl">Učitavanje regije...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-16">
      <p class="text-xl text-red-500">{{ error }}</p>
    </div>

    <!-- Content when data is loaded -->
    <div v-else-if="currentRegija">
      <!-- Hero banner with image as background and title (full width) -->
      <div
        class="relative h-80 w-full bg-cover bg-center"
        :style="{ backgroundImage: `url('${getHeroImage() || ''}')` }"
      >
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"
        ></div>

        <!-- Hero content constrained to max-w-1200 -->
        <div class="absolute inset-0 flex items-end">
          <div class="container mx-auto max-w-1200 px-4 pb-8">
            <div class="flex items-center text-white mb-2">
              <NuxtLink to="/regije" class="flex items-center hover:underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Nazad na Regije
              </NuxtLink>
            </div>
            <h1 class="text-4xl font-bold text-white">
              {{ currentRegija.naziv }}
            </h1>
          </div>
        </div>
      </div>

      <!-- Main content constrained to max-w-1200 -->
      <div class="container mx-auto max-w-1200 py-12 px-4">
        <h2 class="text-2xl font-bold mb-8">O regiji</h2>

        <!-- Main region information -->
        <div class="mb-12">
          <h3 class="text-xl font-semibold mb-4">{{ currentRegija.naziv }}</h3>
          <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2" v-html="currentRegija.opis"></div>
          </div>
        </div>

        <!-- Region destinations (you can add this if needed) -->
        <div v-if="false" class="mb-12">
          <h3 class="text-xl font-semibold mb-4">
            Popularni gradovi i destinacije
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- City cards would go here -->
          </div>
        </div>

        <!-- Accommodations in the region (you can add this if needed) -->
        <div v-if="false" class="mb-12">
          <h3 class="text-xl font-semibold mb-4">Smještaji u regiji</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Accommodation cards would go here -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRegije } from "~/composables/useRegije";

export default defineComponent({
  name: "RegijaPage",

  setup() {
    const route = useRoute();
    const slug = computed(() => route.params.slug as string);

    // Get region data using the composable
    const regijeComposable = useRegije();
    const { currentRegija, isLoading, error, fetchRegijaBySlug, getImageUrl } =
      regijeComposable;

    // Function to get a hero image (either the region image or a default)
    const getHeroImage = () => {
      if (currentRegija.value?.slika) {
        return getImageUrl(currentRegija.value);
      }
      return "/images/default-region-hero.jpg"; // Fallback image
    };

    // Fetch the region data when the component mounts
    onMounted(async () => {
      if (slug.value) {
        await fetchRegijaBySlug(slug.value);
      }
    });

    return {
      currentRegija,
      isLoading,
      error,
      slug,
      getImageUrl,
      getHeroImage,
    };
  },
});
</script>
