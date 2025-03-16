export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-swiper"],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
  },

  runtimeConfig: {
    public: {
      directusUrl:
        process.env.NUXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055",
      directusUserRoleId: process.env.NUXT_PUBLIC_DIRECTUS_USER_ROLE_ID,
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      ],
    },
  },

  plugins: ["~/plugins/vue-tel-input.ts", "~/plugins/toast.ts"],
  build: {
    transpile: ["vue-tel-input"],
  },
});
