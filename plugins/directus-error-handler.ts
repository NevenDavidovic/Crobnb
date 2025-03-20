import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const accessToken = useCookie("directus_access_token");
    const refreshToken = useCookie("directus_refresh_token");

    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;

      if (error?.errors?.[0]?.extensions?.code === "TOKEN_EXPIRED") {
        event.preventDefault();

        accessToken.value = null;
        refreshToken.value = null;

        console.log("Cleared expired tokens");
      }
    });
  }
});
