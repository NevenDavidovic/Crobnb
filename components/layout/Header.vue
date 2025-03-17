<template>
  <header class="w-full border-b border-gray-200">
    <div
      class="mx-auto py-2 flex items-center justify-between h-[82px] max-w-1200 px-4"
    >
      <NuxtLink to="/" class="flex items-center pl-2">
        <img src="/images/logo.svg" alt="Crobnb" class="w-5 h-5" />
        <span class="ml-2 text-gray-100 text-xl font-medium !font-museo"
          ><svg
            width="67"
            height="16"
            viewBox="0 0 67 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.76 15C6.69333 14.9867 5.72 14.8 4.84 14.44C3.96 14.0667 3.2 13.56 2.56 12.92C1.93333 12.28 1.44667 11.54 1.1 10.7C0.766667 9.86 0.6 8.96 0.6 8C0.6 7.04 0.766667 6.14 1.1 5.3C1.44667 4.46 1.93333 3.72 2.56 3.08C3.2 2.44 3.96 1.94 4.84 1.58C5.72 1.20667 6.69333 1.01333 7.76 0.999999H9.56V2.7H7.82C7.06 2.7 6.36 2.84 5.72 3.12C5.08 3.38667 4.52 3.76 4.04 4.24C3.57333 4.70667 3.20667 5.26 2.94 5.9C2.67333 6.54 2.54 7.24 2.54 8C2.54 8.74667 2.67333 9.44667 2.94 10.1C3.20667 10.74 3.57333 11.3 4.04 11.78C4.52 12.2467 5.08 12.6133 5.72 12.88C6.36 13.1467 7.06 13.2867 7.82 13.3H9.56V15H7.76ZM11.6734 15V7.7C11.6734 6.79333 11.9268 6.08667 12.4334 5.58C12.9534 5.06 13.6668 4.8 14.5734 4.8H16.6734V6.38H14.9134C14.4734 6.38 14.1268 6.50667 13.8734 6.76C13.6334 7.01333 13.5134 7.36667 13.5134 7.82V15H11.6734ZM23.1741 15.24C22.1341 15.24 21.2141 15.0067 20.4141 14.54C19.6141 14.06 18.9807 13.42 18.5141 12.62C18.0474 11.8067 17.8141 10.9 17.8141 9.9C17.8141 8.9 18.0474 8 18.5141 7.2C18.9807 6.38667 19.6141 5.74667 20.4141 5.28C21.2141 4.8 22.1341 4.56 23.1741 4.56C24.2141 4.56 25.1341 4.8 25.9341 5.28C26.7474 5.74667 27.3807 6.38 27.8341 7.18C28.3007 7.98 28.5341 8.88667 28.5341 9.9C28.5341 10.9 28.3007 11.8067 27.8341 12.62C27.3807 13.42 26.7474 14.06 25.9341 14.54C25.1341 15.0067 24.2141 15.24 23.1741 15.24ZM23.1741 13.66C23.8807 13.66 24.4941 13.4933 25.0141 13.16C25.5341 12.8267 25.9407 12.38 26.2341 11.82C26.5274 11.2467 26.6741 10.6067 26.6741 9.9C26.6741 9.19333 26.5274 8.56 26.2341 8C25.9407 7.42667 25.5341 6.97333 25.0141 6.64C24.4941 6.30667 23.8807 6.14 23.1741 6.14C22.4807 6.14 21.8674 6.30667 21.3341 6.64C20.8141 6.97333 20.4074 7.42667 20.1141 8C19.8207 8.56 19.6741 9.19333 19.6741 9.9C19.6741 10.6067 19.8207 11.2467 20.1141 11.82C20.4074 12.38 20.8141 12.8267 21.3341 13.16C21.8674 13.4933 22.4807 13.66 23.1741 13.66ZM36.0536 15.24C35.0669 15.24 34.1803 15.0267 33.3936 14.6C32.6069 14.1733 31.9803 13.56 31.5136 12.76C31.0603 11.9467 30.8336 10.9733 30.8336 9.84V0.4H32.6736V6.62H32.7136C32.9403 6.20667 33.2336 5.84667 33.5936 5.54C33.9669 5.23333 34.3869 4.99333 34.8536 4.82C35.3336 4.64667 35.8336 4.56 36.3536 4.56C37.3003 4.56 38.1469 4.77333 38.8936 5.2C39.6403 5.62667 40.2269 6.23333 40.6536 7.02C41.0936 7.79333 41.3136 8.71333 41.3136 9.78C41.3136 10.62 41.1803 11.38 40.9136 12.06C40.6603 12.7267 40.3003 13.3 39.8336 13.78C39.3669 14.26 38.8136 14.6267 38.1736 14.88C37.5336 15.12 36.8269 15.24 36.0536 15.24ZM36.0536 13.66C36.6803 13.66 37.2469 13.5067 37.7536 13.2C38.2736 12.8933 38.6869 12.46 38.9936 11.9C39.3003 11.34 39.4536 10.6733 39.4536 9.9C39.4536 9.15333 39.3003 8.5 38.9936 7.94C38.7003 7.38 38.3003 6.94 37.7936 6.62C37.2869 6.3 36.7136 6.14 36.0736 6.14C35.4469 6.14 34.8736 6.29333 34.3536 6.6C33.8469 6.90667 33.4403 7.34667 33.1336 7.92C32.8403 8.48 32.6936 9.14667 32.6936 9.92C32.6936 10.68 32.8403 11.34 33.1336 11.9C33.4403 12.46 33.8469 12.8933 34.3536 13.2C34.8736 13.5067 35.4403 13.66 36.0536 13.66ZM43.667 15V9.1C43.667 8.19333 43.867 7.4 44.267 6.72C44.6804 6.04 45.247 5.51333 45.967 5.14C46.687 4.75333 47.507 4.56 48.427 4.56C49.3604 4.56 50.1804 4.75333 50.887 5.14C51.607 5.51333 52.167 6.04 52.567 6.72C52.9804 7.4 53.187 8.19333 53.187 9.1V15H51.347V9.12C51.347 8.50667 51.207 7.98 50.927 7.54C50.6604 7.08667 50.3004 6.74 49.847 6.5C49.407 6.26 48.9337 6.14 48.427 6.14C47.9204 6.14 47.4404 6.26 46.987 6.5C46.547 6.74 46.187 7.08667 45.907 7.54C45.6404 7.98 45.507 8.50667 45.507 9.12V15H43.667ZM61.2684 15.24C60.2818 15.24 59.3951 15.0267 58.6084 14.6C57.8218 14.1733 57.1951 13.56 56.7284 12.76C56.2751 11.9467 56.0484 10.9733 56.0484 9.84V0.4H57.8884V6.62H57.9284C58.1551 6.20667 58.4484 5.84667 58.8084 5.54C59.1818 5.23333 59.6018 4.99333 60.0684 4.82C60.5484 4.64667 61.0484 4.56 61.5684 4.56C62.5151 4.56 63.3618 4.77333 64.1084 5.2C64.8551 5.62667 65.4418 6.23333 65.8684 7.02C66.3084 7.79333 66.5284 8.71333 66.5284 9.78C66.5284 10.62 66.3951 11.38 66.1284 12.06C65.8751 12.7267 65.5151 13.3 65.0484 13.78C64.5818 14.26 64.0284 14.6267 63.3884 14.88C62.7484 15.12 62.0418 15.24 61.2684 15.24ZM61.2684 13.66C61.8951 13.66 62.4618 13.5067 62.9684 13.2C63.4884 12.8933 63.9018 12.46 64.2084 11.9C64.5151 11.34 64.6684 10.6733 64.6684 9.9C64.6684 9.15333 64.5151 8.5 64.2084 7.94C63.9151 7.38 63.5151 6.94 63.0084 6.62C62.5018 6.3 61.9284 6.14 61.2884 6.14C60.6618 6.14 60.0884 6.29333 59.5684 6.6C59.0618 6.90667 58.6551 7.34667 58.3484 7.92C58.0551 8.48 57.9084 9.14667 57.9084 9.92C57.9084 10.68 58.0551 11.34 58.3484 11.9C58.6551 12.46 59.0618 12.8933 59.5684 13.2C60.0884 13.5067 60.6551 13.66 61.2684 13.66Z"
              fill="#202532"
            />
          </svg>
        </span>
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
          @click="goToFavorites"
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
        <NuxtLink :to="authLink.path" class="pr-2 hidden md:block">
          {{ authLink.label }}
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
        <NuxtLink
          :to="authLink.path"
          class="block py-2 text-gray-700 hover:text-teal-600 transition-colors text-center"
          @click="mobileMenuOpen = false"
        >
          {{ authLink.label }}
        </NuxtLink>

        <div class="md:hidden mt-4 flex items-center justify-center">
          <HeaderLanguageSelector />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
interface NavItem {
  label: string;
  path: string;
}

interface AuthLink {
  label: string;
  path: string;
}

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const goToFavorites = () => {
      router.push("/favoriti");
    };

    const navItems: NavItem[] = [
      { label: "Tipovi smještaja", path: "/tipovi-smjestaja" },
      { label: "Regije", path: "/regije" },
      { label: "Novosti", path: "/novosti-index" },
    ];

    const mobileNavItems: NavItem[] = [
      ...navItems,
      { label: "Favoriti", path: "#" },
    ];

    const mobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    // Računamo koji link za prijavu/profil prikazati
    const authLink = computed<AuthLink>(() => {
      return authStore.isAuthenticated
        ? { label: "Profil", path: "/profil" }
        : { label: "Prijava", path: "/auth/prijava" };
    });

    return {
      navItems,
      mobileNavItems,
      mobileMenuOpen,
      toggleMobileMenu,
      authLink,
      goToFavorites,
    };
  },
});
</script>
