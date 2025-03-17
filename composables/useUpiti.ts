import type { UpitFormData } from "~/types/directus/exports/upit";

export const useUpiti = () => {
  const { $createUpit } = useNuxtApp();

  const isSubmitting = ref<boolean>(false);
  const error = ref<string | null>(null);

  const submitUpit = async (
    upitData: UpitFormData
  ): Promise<{ success: boolean; error?: string }> => {
    isSubmitting.value = true;
    error.value = null;

    try {
      await $createUpit(upitData);
      isSubmitting.value = false;
      return { success: true };
    } catch (err: unknown) {
      console.error("Error submitting inquiry:", err);

      // Type-safe error handling
      if (err instanceof Error) {
        error.value = err.message || "Failed to submit inquiry";
      } else if (typeof err === "string") {
        error.value = err;
      } else {
        error.value = "Failed to submit inquiry";
      }

      isSubmitting.value = false;
      return { success: false, error: error.value || undefined };
    }
  };

  return {
    isSubmitting,
    error,
    submitUpit,
  };
};
