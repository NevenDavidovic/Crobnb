// plugins/directus-error-handler.ts
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const accessToken = useCookie("directus_access_token");
    const refreshToken = useCookie("directus_refresh_token");

    // Global error handler for Directus API errors
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;

      // Check for Directus token expiration
      if (error?.errors?.[0]?.extensions?.code === "TOKEN_EXPIRED") {
        // Don't show the error in console
        event.preventDefault();

        // Clear tokens
        accessToken.value = null;
        refreshToken.value = null;

        // Optionally refresh the page to reset the app state
        // window.location.reload();

        console.log("Cleared expired tokens");
      }
    });
  }
});
