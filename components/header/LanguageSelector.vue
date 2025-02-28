<template>
  <div class="relative" ref="dropdownElement">
    <div @click="toggleDropdown" class="flex items-center cursor-pointer">
      <div
        class="flex flex-col items-center rounded-md px-2 py-1 w-[35px] h-[48px] gap-1 p-1"
      >
        <img
          :src="getFlagSrc(selectedLanguage.code)"
          :alt="selectedLanguage.code.toUpperCase()"
          class="h-4 w-6"
        />
        <span class="text-xs font-medium text-gray-700">{{
          selectedLanguage.label
        }}</span>
      </div>

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
        class="ml-1 text-gray-400"
        :class="{ 'transform rotate-180': isOpen }"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 bg-white rounded-md shadow-lg border border-gray-200 w-28"
    >
      <div class="py-1">
        <div
          v-for="language in languages"
          :key="language.code"
          @click="selectLanguage(language)"
          class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-gray-50': language.code === selectedLanguage.code }"
        >
          <img
            :src="getFlagSrc(language.code)"
            :alt="language.code.toUpperCase()"
            class="h-4 w-6"
          />
          <span class="ml-2">{{ language.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Language {
  code: string;
  name: string;
  label: string;
}

const languages: Language[] = [
  { code: "hr", name: "Hrvatski", label: "HRV" },
  { code: "en", name: "English", label: "ENG" },
];

const isOpen = ref(false);
const selectedLanguage = ref(languages[0]);
const dropdownElement = ref<HTMLElement | null>(null);

const getFlagSrc = (code: string) => `/images/${code}-flag.svg`;

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const clickOutsideHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (dropdownElement.value && !dropdownElement.value.contains(target)) {
    isOpen.value = false;
  }
};

watch(isOpen, (newVal: boolean) => {
  if (newVal) {
    window.addEventListener("click", clickOutsideHandler);
  } else {
    window.removeEventListener("click", clickOutsideHandler);
  }
});

onUnmounted(() => {
  window.removeEventListener("click", clickOutsideHandler);
});

const selectLanguage = (language: Language) => {
  selectedLanguage.value = language;
  isOpen.value = false;
};
</script>
