import type { Novost, KategorijaNovosti } from "~/types/directus/index";

export const useNovosti = () => {
  const {
    $getNovosti,
    $getNovost,
    $getNovostiByKategorija,
    $getNovostBySlug,
    $getKategorijeNovosti,
    $getFileUrl,
  } = useNuxtApp();

  const novosti = ref<Novost[]>([]);
  const currentNovost = ref<Novost | null>(null);
  const kategorijeNovosti = ref<KategorijaNovosti[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const categoriesMap = ref<Record<number, KategorijaNovosti>>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const parts = date
      .toLocaleDateString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split(".");

    return parts.filter(Boolean).join("/");
  };

  const ensureCategoriesLoaded = async () => {
    if (Object.keys(categoriesMap.value).length === 0) {
      try {
        const response = (await $getKategorijeNovosti()) as KategorijaNovosti[];
        kategorijeNovosti.value = response;

        kategorijeNovosti.value.forEach((cat) => {
          categoriesMap.value[cat.id] = cat;
        });

        console.log("Categories loaded:", kategorijeNovosti.value);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }
  };

  const fetchNovosti = async (limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      await ensureCategoriesLoaded();

      const response = (await $getNovosti(limit)) as Novost[];

      novosti.value = response.map((item) => ({
        ...item,
        kategorija_novosti: item.kategorija_novosti_id
          ? categoriesMap.value[item.kategorija_novosti_id]
          : undefined,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching novosti:", err);
      error.value = "Failed to load news";
      isLoading.value = false;
    }
  };

  const fetchNovostiByKategorija = async (
    kategorijaId: number,
    limit?: number
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      await ensureCategoriesLoaded();

      const response = (await $getNovostiByKategorija(
        kategorijaId,
        limit
      )) as Omit<Novost, "kategorija_novosti">[];

      novosti.value = response.map((item) => ({
        ...item,
        kategorija_novosti: item.kategorija_novosti_id
          ? categoriesMap.value[item.kategorija_novosti_id]
          : undefined,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error(
        `Error fetching novosti by kategorija ${kategorijaId}:`,
        err
      );
      error.value = "Failed to load news for this category";
      isLoading.value = false;
    }
  };

  const fetchNovost = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      await ensureCategoriesLoaded();

      const response = (await $getNovost(id)) as Omit<
        Novost,
        "kategorija_novosti"
      >;

      currentNovost.value = {
        ...response,
        kategorija_novosti: response.kategorija_novosti_id
          ? categoriesMap.value[response.kategorija_novosti_id]
          : undefined,
      };

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching novost with ID ${id}:`, err);
      error.value = "Failed to load news article";
      isLoading.value = false;
    }
  };

  const fetchNovostBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await ensureCategoriesLoaded();

      const response = (await $getNovostBySlug(slug)) as Omit<
        Novost,
        "kategorija_novosti"
      > | null;

      if (!response) {
        error.value = "News article not found";
        currentNovost.value = null;
      } else {
        currentNovost.value = {
          ...response,
          kategorija_novosti: response.kategorija_novosti_id
            ? categoriesMap.value[response.kategorija_novosti_id]
            : undefined,
        };
      }

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching novost with slug ${slug}:`, err);
      error.value = "Failed to load news article";
      isLoading.value = false;
    }
  };

  const fetchKategorijeNovosti = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await $getKategorijeNovosti()) as KategorijaNovosti[];

      kategorijeNovosti.value = response;

      kategorijeNovosti.value.forEach((cat) => {
        categoriesMap.value[cat.id] = cat;
      });

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching kategorije novosti:", err);
      error.value = "Failed to load news categories";
      isLoading.value = false;
    }
  };

  const getHeroImageUrl = (novost: Novost): string | null => {
    if (!novost.hero_slika) return null;
    return $getFileUrl(novost.hero_slika);
  };

  return {
    novosti,
    currentNovost,
    kategorijeNovosti,
    isLoading,
    error,
    fetchNovosti,
    fetchNovostiByKategorija,
    fetchNovost,
    fetchNovostBySlug,
    fetchKategorijeNovosti,
    getHeroImageUrl,
    formatDate,
  };
};
