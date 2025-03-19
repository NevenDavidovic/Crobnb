export function useResetPassword() {
  const route = useRoute();
  const { $resetPassword } = useNuxtApp();
  const router = useRouter();

  const token = computed(() => route.query.token as string);
  const password = ref("");
  const confirmPassword = ref("");
  const isSubmitting = ref(false);
  const message = ref("");
  const isSuccess = ref(false);
  const error = ref<string | null>(null);

  const resetPassword = async () => {
    if (!password.value || !token.value) return;

    if (password.value !== confirmPassword.value) {
      error.value = "Lozinke se ne podudaraju.";
      return;
    }

    isSubmitting.value = true;
    message.value = "";
    error.value = null;

    try {
      await $resetPassword(token.value, password.value);

      isSuccess.value = true;
      message.value = "Tvoja lozinka je uspješno resetirana.";

      password.value = "";
      confirmPassword.value = "";

      setTimeout(() => {
        router.push("/auth/prijava");
      }, 3000);
    } catch (err: unknown) {
      isSubmitting.value = false;
      isSuccess.value = false;

      if (err instanceof Error) {
        error.value =
          err.message || "Došlo je do greške. Molimo pokušajte ponovno.";
      } else if (typeof err === "string") {
        error.value = err;
      } else {
        error.value = "Došlo je do greške. Molimo pokušajte ponovno.";
      }

      console.error("Password reset error:", err);
    }
  };

  return {
    token,
    password,
    confirmPassword,
    isSubmitting,
    message,
    isSuccess,
    error,
    resetPassword,
  };
}
