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

    // Validate password confirmation
    if (password.value !== confirmPassword.value) {
      error.value = "Lozinke se ne podudaraju.";
      return;
    }

    isSubmitting.value = true;
    message.value = "";
    error.value = null;

    try {
      await $resetPassword(token.value, password.value);

      // If no error, show success message
      isSuccess.value = true;
      message.value = "Tvoja lozinka je uspješno resetirana.";

      // Clear form fields
      password.value = "";
      confirmPassword.value = "";

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      // Handle errors
      isSuccess.value = false;

      if (err.errors && Array.isArray(err.errors)) {
        error.value =
          err.errors[0]?.message || "Greška prilikom resetiranja lozinke";
      } else if (err.response && err.response.status === 400) {
        error.value = "Nevažeći ili istekli token za resetiranje.";
      } else {
        error.value =
          err.message || "Došlo je do greške. Molimo pokušajte ponovno.";
      }

      console.error("Password reset error:", err);
    } finally {
      isSubmitting.value = false;
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
