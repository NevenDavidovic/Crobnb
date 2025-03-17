export function usePasswordReset() {
  const { $requestPasswordReset } = useNuxtApp();
  const email = ref("");
  const isSubmitting = ref(false);
  const message = ref("");
  const isSuccess = ref(false);
  const error = ref<string | null>(null);

  const requestReset = async () => {
    if (!email.value) return;

    isSubmitting.value = true;
    message.value = "";
    error.value = null;

    try {
      await $requestPasswordReset(email.value);

      isSuccess.value = true;
      message.value =
        "Link za resetiranje lozinke je poslan na tvoj email. Ako ne primite email u roku od 5 minuta, molimo kontaktirajte administratora.";
      email.value = "";
    } catch (err: unknown) {
      isSubmitting.value = false;
      isSuccess.value = false;

      // Type-safe error handling
      if (err instanceof Error) {
        error.value =
          err.message || "Došlo je do greške. Molimo pokušajte ponovno.";
      } else if (typeof err === "string") {
        error.value = err;
      } else {
        error.value = "Došlo je do greške. Molimo pokušajte ponovno.";
      }

      console.error("Password reset request error:", err);
    }
  };

  return {
    email,
    isSubmitting,
    message,
    isSuccess,
    error,
    requestReset,
  };
}
