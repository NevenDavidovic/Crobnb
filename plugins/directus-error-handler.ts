import { defineNuxtPlugin, useRouter } from "#app";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const router = useRouter();
    const accessToken = useCookie("directus_access_token");
    const refreshToken = useCookie("directus_refresh_token");

    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;

      if (error?.errors?.[0]?.extensions?.code === "TOKEN_EXPIRED") {
        event.preventDefault();

        accessToken.value = null;
        refreshToken.value = null;

        router.push("/login?expired=true");
      }
    });
  }
});
