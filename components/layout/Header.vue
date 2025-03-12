<template>
  <header class="w-full border-b border-gray-200">
    <div
      class="mx-auto py-2 flex items-center justify-between h-[82px] max-w-1200 px-4"
    >
      <NuxtLink to="/" class="flex items-center pl-2">
        <img src="/images/logo.svg" alt="Crobnb" class="w-5 h-5" />
        <span class="ml-2 text-gray-100 text-xl font-medium !font-museo"
          >Crobnb</span
        >
      </NuxtLink>

      <nav class="hidden md:flex items-center space-x-8">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="text-gray-100 hover:text-teal-600 transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center space-x-4">
        <button
          class="text-gray-600 hover:text-red-500 transition-colors md:block hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#00526C"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <div class="hidden md:block">
          <HeaderLanguageSelector />
        </div>
        <NuxtLink to="/auth/prijava" class="pr-2 hidden md:block">
          Prijava
        </NuxtLink>

        <button class="md:hidden text-gray-600" @click="toggleMobileMenu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-white absolute top-[82px] left-0 right-0 bottom-0 shadow-md z-50"
    >
      <div class="container mx-auto px-4 py-4">
        <NuxtLink
          v-for="item in mobileNavItems"
          :key="item.path"
          :to="item.path"
          class="block py-2 text-gray-700 hover:text-teal-600 transition-colors text-center"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink to="/prijava" class="text-center"> Prijava </NuxtLink>

        <div class="md:hidden mt-4 flex items-center justify-center">
          <HeaderLanguageSelector />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const navItems = [
      { label: "Tipovi smještaja", path: "/tipovi-smjestaja" },
      { label: "Regije", path: "/regije" },
      { label: "Novosti", path: "/novosti-index" },
    ];

    const mobileNavItems = [...navItems, { label: "Favoriti", path: "#" }];

    const mobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    return {
      navItems,
      mobileNavItems,
      mobileMenuOpen,
      toggleMobileMenu,
    };
  },
});
</script>
