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
    return date.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const ensureCategoriesLoaded = async () => {
    if (Object.keys(categoriesMap.value).length === 0) {
      try {
        const response = await $getKategorijeNovosti();
        kategorijeNovosti.value = response.map((item: any) => ({
          id: item.id,
          naziv: item.naziv,
        }));

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

      const response = await $getNovosti(limit);

      novosti.value = response.map((item: any) => {
        const categoryId = item.kategorija_novosti_id;
        const category = categoryId
          ? categoriesMap.value[categoryId]
          : undefined;

        return {
          id: item.id,
          date_created: item.date_created,
          date_updated: item.date_updated,
          naslov: item.naslov,
          kratki_opis: item.kratki_opis,
          sadrzaj: item.sadrzaj,
          hero_slika: item.hero_slika,
          kategorija_novosti_id: item.kategorija_novosti_id,
          kategorija_novosti: category,
          slug: item.slug,
        };
      });

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

      const response = await $getNovostiByKategorija(kategorijaId, limit);

      novosti.value = response.map((item: any) => {
        const categoryId = item.kategorija_novosti_id;
        const category = categoryId
          ? categoriesMap.value[categoryId]
          : undefined;

        return {
          id: item.id,
          date_created: item.date_created,
          date_updated: item.date_updated,
          naslov: item.naslov,
          kratki_opis: item.kratki_opis,
          sadrzaj: item.sadrzaj,
          hero_slika: item.hero_slika,
          kategorija_novosti_id: item.kategorija_novosti_id,
          kategorija_novosti: category,
          slug: item.slug,
        };
      });

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

      const response = await $getNovost(id);

      const categoryId = response.kategorija_novosti_id;
      const category = categoryId ? categoriesMap.value[categoryId] : undefined;

      currentNovost.value = {
        id: response.id,
        date_created: response.date_created,
        date_updated: response.date_updated,
        naslov: response.naslov,
        kratki_opis: response.kratki_opis,
        sadrzaj: response.sadrzaj,
        hero_slika: response.hero_slika,
        kategorija_novosti_id: response.kategorija_novosti_id,
        kategorija_novosti: category,
        slug: response.slug,
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

      const response = await $getNovostBySlug(slug);

      if (!response) {
        error.value = "News article not found";
        currentNovost.value = null;
      } else {
        const categoryId = response.kategorija_novosti_id;
        const category = categoryId
          ? categoriesMap.value[categoryId]
          : undefined;

        currentNovost.value = {
          id: response.id,
          date_created: response.date_created,
          date_updated: response.date_updated,
          naslov: response.naslov,
          kratki_opis: response.kratki_opis,
          sadrzaj: response.sadrzaj,
          hero_slika: response.hero_slika,
          kategorija_novosti_id: response.kategorija_novosti_id,
          kategorija_novosti: category,
          slug: response.slug,
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
      const response = await $getKategorijeNovosti();

      kategorijeNovosti.value = response.map((item: any) => ({
        id: item.id,
        naziv: item.naziv,
      }));

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
