export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();
  const isAuthorized = await authStore.checkAuth();

  if (!isAuthorized) {
    return navigateTo("/auth/prijava");
  }
});
