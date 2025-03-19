import type { Regija } from "~/types/directus";

export const useRegije = () => {
  const { $getRegije, $getRegija, $getRegijaBySlug, $getFileUrl } =
    useNuxtApp();

  const regije = ref<Regija[]>([]);
  const currentRegija = ref<Regija | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchRegije = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getRegije()) as Regija[];
      regije.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching regije:", err);
      error.value = "Failed to load regions";
      isLoading.value = false;
    }
  };

  const fetchRegija = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getRegija(id)) as Regija;
      currentRegija.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching regija with ID ${id}:`, err);
      error.value = "Failed to load region";
      isLoading.value = false;
    }
  };

  const fetchRegijaBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getRegijaBySlug(slug);

      if (!response) {
        error.value = "Region not found";
        currentRegija.value = null;
      } else {
        currentRegija.value = response;
      }

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching regija with slug ${slug}:`, err);
      error.value = "Failed to load region";
      isLoading.value = false;
    }
  };

  const getImageUrl = (regija: Regija): string | null => {
    if (!regija.slika) return null;
    return $getFileUrl(regija.slika);
  };

  return {
    regije,
    currentRegija,
    isLoading,
    error,
    fetchRegije,
    fetchRegija,
    fetchRegijaBySlug,
    getImageUrl,
  };
};
