<template>
  <div class="relative">
    <div
      class="relative h-[500px] md:h-[400px] lg:h-[500px] w-full overflow-hidden"
    >
      <img
        :src="imgSrc"
        alt="Luxury accommodation in Croatia"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        class="absolute inset-0 bg-gradient-to-r from-teal-900/30 to-transparent"
      ></div>

      <div
        class="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-20"
      >
        <div class="max-w-1200 mx-auto w-full">
          <h1
            class="text-3xl md:text-4xl lg:text-[55px] font-bold text-primary-100 px-4 max-w-[700px] !leading-normal"
          >
            Otkrijte najbolje smještaje diljem Hrvatske
          </h1>
          <p
            class="mt-3 md:mt-4 text-base md:text-lg text-gray-100 max-w-xl px-4"
          >
            {{ subheading }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="relative px-4 sm:px-6 lg:px-8 mx-auto"
      :class="filterPosition === 'overlap' ? '-mt-20' : 'mt-6'"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "HeroSection",
  props: {
    imgSrc: {
      type: String,
      default: "/images/homepage-hero-banner.jpg",
    },
    subheading: {
      type: String,
      default:
        "Odaberite između luksuznih vila, hotela, apartmana, mobilnih kućica ili turističkih naselja i osigurajte svoj savršeni odmor po mjeri.",
    },
    filterPosition: {
      type: String,
      default: "overlap",
      validator: (value: string) => ["overlap", "below"].includes(value),
    },
  },
  setup() {
    return {};
  },
});
</script>
