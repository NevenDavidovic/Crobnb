import type { Regija } from "~/types/directus/index";

export const useRegije = () => {
  const { $getRegije, $getRegija, $getRegijaBySlug, $getFileUrl } =
    useNuxtApp();

  const regije = ref<Regija[]>([]);
  const currentRegija = ref<Regija | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all regions
  const fetchRegije = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getRegije();

      regije.value = response.map((item: any) => ({
        id: item.id,
        naziv: item.naziv,
        kratki_opis: item.kratki_opis,
        opis: item.opis,
        slika: item.slika,
        slug: item.slug,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching regije:", err);
      error.value = "Failed to load regions";
      isLoading.value = false;
    }
  };

  // Fetch a single region by ID
  const fetchRegija = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getRegija(id);

      currentRegija.value = {
        id: response.id,
        naziv: response.naziv,
        kratki_opis: response.kratki_opis,
        opis: response.opis,
        slika: response.slika,
        slug: response.slug,
      };

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching regija with ID ${id}:`, err);
      error.value = "Failed to load region";
      isLoading.value = false;
    }
  };

  // Fetch a single region by slug
  const fetchRegijaBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getRegijaBySlug(slug);

      if (!response) {
        error.value = "Region not found";
        currentRegija.value = null;
      } else {
        currentRegija.value = {
          id: response.id,
          naziv: response.naziv,
          kratki_opis: response.kratki_opis,
          opis: response.opis,
          slika: response.slika,
          slug: response.slug,
        };
      }

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching regija with slug ${slug}:`, err);
      error.value = "Failed to load region";
      isLoading.value = false;
    }
  };

  // Get the URL for a region image
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
