import type { TipSmjestaja } from "~/types/directus/index";

export const useTipoviSmjestaja = () => {
  const {
    $getTipoviSmjestaja,
    $getTipSmjestaja,
    $getTipSmjestajaBySlug,
    $getFileUrl,
  } = useNuxtApp();

  const tipovi = ref<TipSmjestaja[]>([]);
  const currentTip = ref<TipSmjestaja | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchTipovi = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getTipoviSmjestaja()) as TipSmjestaja[];
      tipovi.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching tipovi_smjestaja:", err);
      error.value = "Failed to load accommodation types";
      isLoading.value = false;
    }
  };

  const fetchTip = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getTipSmjestaja(id)) as TipSmjestaja;
      currentTip.value = response;
      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching tip_smjestaja with ID ${id}:`, err);
      error.value = "Failed to load accommodation type";
      isLoading.value = false;
    }
  };

  const fetchTipBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getTipSmjestajaBySlug(slug);

      if (!response) {
        error.value = "Accommodation type not found";
        currentTip.value = null;
      } else {
        currentTip.value = response;
      }

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching tip_smjestaja with slug ${slug}:`, err);
      error.value = "Failed to load accommodation type";
      isLoading.value = false;
    }
  };

  const getIconUrl = (tip: TipSmjestaja): string | null => {
    if (!tip.ikona) return null;
    return $getFileUrl(tip.ikona);
  };

  return {
    tipovi,
    currentTip,
    isLoading,
    error,
    fetchTipovi,
    fetchTip,
    fetchTipBySlug,
    getIconUrl,
  };
};
