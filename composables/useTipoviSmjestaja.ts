import type { TipSmjestaja } from "~/types/directus";

export const useTipoviSmjestaja = () => {
  const { $getTipoviSmjestaja, $getTipSmjestaja, $getFileUrl } = useNuxtApp();

  const tipovi = ref<TipSmjestaja[]>([]);
  const currentTip = ref<TipSmjestaja | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Fetch all accommodation types
  const fetchTipovi = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Cast the response to ensure TypeScript compatibility
      const response = await $getTipoviSmjestaja();

      // Map the response to match your TipSmjestaja interface
      tipovi.value = response.map((item: any) => ({
        id: item.id,
        naziv: item.naziv,
        ikona: item.ikona,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching tipovi_smjestaja:", err);
      error.value = "Failed to load accommodation types";
      isLoading.value = false;
    }
  };

  // Fetch a single accommodation type by ID
  const fetchTip = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getTipSmjestaja(id);

      // Map the response to match your TipSmjestaja interface
      currentTip.value = {
        id: response.id,
        naziv: response.naziv,
        ikona: response.ikona,
      };

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching tip_smjestaja with ID ${id}:`, err);
      error.value = "Failed to load accommodation type";
      isLoading.value = false;
    }
  };

  // Get the URL for an icon file
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
    getIconUrl,
  };
};
