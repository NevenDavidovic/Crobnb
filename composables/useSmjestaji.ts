import type {
  Smjestaj,
  Sadrzaj,
  SmjestajSadrzaj,
} from "~/types/directus/index";

export const useSmjestaji = () => {
  const {
    $getSmjestaji,
    $getSmjestaj,
    $getSmjestajiByRegija,
    $getSmjestajiByTip,
    $getSmjestajBySlug,
    $getSadrzaji,
    $getFileUrl,
  } = useNuxtApp();

  const smjestaji = ref<Smjestaj[]>([]);
  const currentSmjestaj = ref<Smjestaj | null>(null);
  const sadrzaji = ref<Sadrzaj[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} EUR`;
  };

  const convertToHRK = (priceEUR: number): number => {
    // Fixed conversion rate (Euro to Croatian Kuna)
    const conversionRate = 7.5345;
    const result = priceEUR * conversionRate;
    return result;
  };

  const formatPriceHRK = (priceEUR: number): string => {
    const priceHRK = convertToHRK(priceEUR);
    return `${priceHRK.toFixed(2)} HRK`;
  };

  const fetchSmjestaji = async (limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSmjestaji(limit);

      const mappedSmjestaji = response.map((item: any) => ({
        ...item,
        sadrzaji: item.sadrzaji || [],
      }));

      smjestaji.value = mappedSmjestaji;

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching smjestaji:", err);
      error.value = "Failed to load accommodation listings";
      isLoading.value = false;
    }
  };

  const fetchSmjestajiByRegija = async (regijaId: number, limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSmjestajiByRegija(regijaId, limit);

      smjestaji.value = response.map((item: any) => ({
        id: item.id,
        date_created: item.date_created,
        date_updated: item.date_updated,
        naziv: item.naziv,
        adresa: item.adresa,
        postanski_broj: item.postanski_broj,
        grad: item.grad,
        cijena_nocenja: item.cijena_nocenja,
        check_in: item.check_in,
        check_out: item.check_out,
        broj_zvjezdica: item.broj_zvjezdica,
        max_broj_gostiju: item.max_broj_gostiju,
        thumbnail: item.thumbnail,
        regija_id: item.regija_id,
        tipovi_smjestaja_id: item.tipovi_smjestaja_id,
        boravisna_pristojba: item.boravisna_pristojba,
        detaljan_opis: item.detaljan_opis,
        kratki_opis: item.kratki_opis,
        broj_kreveta: item.broj_kreveta,
        broj_kupaonica: item.broj_kupaonica,
        slug: item.slug,
        regija: item.regija,
        tip_smjestaja: item.tip_smjestaja,
        sadrzaji: item.sadrzaji,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaji by regija ${regijaId}:`, err);
      error.value = "Failed to load accommodation listings for this region";
      isLoading.value = false;
    }
  };

  const fetchSmjestajiByTip = async (tipId: number, limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSmjestajiByTip(tipId, limit);

      smjestaji.value = response.map((item: any) => ({
        id: item.id,
        date_created: item.date_created,
        date_updated: item.date_updated,
        naziv: item.naziv,
        adresa: item.adresa,
        postanski_broj: item.postanski_broj,
        grad: item.grad,
        cijena_nocenja: item.cijena_nocenja,
        check_in: item.check_in,
        check_out: item.check_out,
        broj_zvjezdica: item.broj_zvjezdica,
        max_broj_gostiju: item.max_broj_gostiju,
        thumbnail: item.thumbnail,
        regija_id: item.regija_id,
        tipovi_smjestaja_id: item.tipovi_smjestaja_id,
        boravisna_pristojba: item.boravisna_pristojba,
        detaljan_opis: item.detaljan_opis,
        kratki_opis: item.kratki_opis,
        broj_kreveta: item.broj_kreveta,
        broj_kupaonica: item.broj_kupaonica,
        slug: item.slug,
        regija: item.regija,
        tip_smjestaja: item.tip_smjestaja,
        sadrzaji: item.sadrzaji,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaji by tip ${tipId}:`, err);
      error.value = "Failed to load accommodation listings for this type";
      isLoading.value = false;
    }
  };

  const fetchSmjestaj = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSmjestaj(id);

      currentSmjestaj.value = {
        id: response.id,
        date_created: response.date_created,
        date_updated: response.date_updated,
        naziv: response.naziv,
        adresa: response.adresa,
        postanski_broj: response.postanski_broj,
        grad: response.grad,
        cijena_nocenja: response.cijena_nocenja,
        check_in: response.check_in,
        check_out: response.check_out,
        broj_zvjezdica: response.broj_zvjezdica,
        max_broj_gostiju: response.max_broj_gostiju,
        thumbnail: response.thumbnail,
        regija_id: response.regija_id,
        tipovi_smjestaja_id: response.tipovi_smjestaja_id,
        boravisna_pristojba: response.boravisna_pristojba,
        detaljan_opis: response.detaljan_opis,
        kratki_opis: response.kratki_opis,
        broj_kreveta: response.broj_kreveta,
        broj_kupaonica: response.broj_kupaonica,
        slug: response.slug,
        regija: response.regija,
        tip_smjestaja: response.tip_smjestaja,
        sadrzaji: response.sadrzaji,
      };

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaj with ID ${id}:`, err);
      error.value = "Failed to load accommodation details";
      isLoading.value = false;
    }
  };

  const fetchSmjestajBySlug = async (slug: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSmjestajBySlug(slug);

      if (!response) {
        error.value = "Accommodation not found";
        currentSmjestaj.value = null;
      } else {
        currentSmjestaj.value = {
          id: response.id,
          date_created: response.date_created,
          date_updated: response.date_updated,
          naziv: response.naziv,
          adresa: response.adresa,
          postanski_broj: response.postanski_broj,
          grad: response.grad,
          cijena_nocenja: response.cijena_nocenja,
          check_in: response.check_in,
          check_out: response.check_out,
          broj_zvjezdica: response.broj_zvjezdica,
          max_broj_gostiju: response.max_broj_gostiju,
          thumbnail: response.thumbnail,
          regija_id: response.regija_id,
          tipovi_smjestaja_id: response.tipovi_smjestaja_id,
          boravisna_pristojba: response.boravisna_pristojba,
          detaljan_opis: response.detaljan_opis,
          kratki_opis: response.kratki_opis,
          broj_kreveta: response.broj_kreveta,
          broj_kupaonica: response.broj_kupaonica,
          slug: response.slug,
          regija: response.regija,
          tip_smjestaja: response.tip_smjestaja,
          sadrzaji: response.sadrzaji,
        };
      }

      isLoading.value = false;
    } catch (err) {
      console.error(`Error fetching smjestaj with slug ${slug}:`, err);
      error.value = "Failed to load accommodation details";
      isLoading.value = false;
    }
  };

  const fetchSmjestajSadrzajiRelations = async () => {
    isLoading.value = true;

    try {
      if (sadrzaji.value.length === 0) {
        await fetchSadrzaji();
      }

      if (smjestaji.value.length === 0) {
        await fetchSmjestaji();
      }

      const { $getSmjestajSadrzajiRelations } = useNuxtApp();
      const relations = await $getSmjestajSadrzajiRelations();

      const relationsBySmjestajId: Record<number, any[]> = {};
      relations.forEach((relation: any) => {
        if (!relationsBySmjestajId[relation.smjestaj_id]) {
          relationsBySmjestajId[relation.smjestaj_id] = [];
        }
        relationsBySmjestajId[relation.smjestaj_id].push(relation);
      });

      smjestaji.value = smjestaji.value.map((smjestaj) => {
        const smjestajRelations = relationsBySmjestajId[smjestaj.id] || [];

        const smjestajSadrzaji: SmjestajSadrzaj[] = smjestajRelations.map(
          (relation: any) => {
            const sadrzajItem = sadrzaji.value.find(
              (s) => s.id === relation.sadrzaj_id
            );

            if (!sadrzajItem) {
              console.log(
                `Warning: Sadrzaj ID ${relation.sadrzaj_id} not found in loaded sadrzaji list`
              );
            }

            return {
              id: relation.id,
              sadrzaj_id: relation.sadrzaj_id,
              smjestaj_id: relation.smjestaj_id,
              sadrzaj: sadrzajItem || relation.sadrzaj, // Use either the found item or the one from relation if available
            };
          }
        );

        return {
          ...smjestaj,
          sadrzaji: smjestajSadrzaji,
        };
      });

      isLoading.value = false;
    } catch (error) {
      console.error("Error fetching sadrzaji relations:", error);
      isLoading.value = false;
    }
  };

  const fetchSadrzaji = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSadrzaji();

      sadrzaji.value = response.map((item: any) => ({
        id: item.id,
        naziv: item.naziv,
        icon: item.icon,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching sadrzaji:", err);
      error.value = "Failed to load amenities";
      isLoading.value = false;
    }
  };

  const getThumbnailUrl = (smjestaj: Smjestaj): string | null => {
    if (!smjestaj.thumbnail) return null;
    const url = $getFileUrl(smjestaj.thumbnail);
    return url;
  };

  const getFullAddress = (smjestaj: Smjestaj): string => {
    const address = `${smjestaj.adresa}, ${smjestaj.postanski_broj} ${
      smjestaj.grad
    }, ${smjestaj.regija?.naziv || "Hrvatska"}`;
    return address;
  };

  const hasAmenity = (smjestaj: Smjestaj, amenityId: number): boolean => {
    if (!smjestaj.sadrzaji) return false;

    const result = smjestaj.sadrzaji.some((item) => {
      return (
        item.sadrzaj_id === amenityId ||
        (item.sadrzaj && item.sadrzaj.id === amenityId)
      );
    });

    return result;
  };

  const getSadrzajIconUrl = (sadrzaj: Sadrzaj | undefined): string | null => {
    if (!sadrzaj || !sadrzaj.icon) return null;
    const url = $getFileUrl(sadrzaj.icon);

    return url;
  };

  const getSmjestajSadrzaji = (smjestaj: Smjestaj): Sadrzaj[] => {
    if (!smjestaj.sadrzaji) return [];

    const result = smjestaj.sadrzaji
      .map((item) => {
        return item.sadrzaj;
      })
      .filter((sadrzaj): sadrzaj is Sadrzaj => {
        const isValid = !!sadrzaj;
        if (!isValid) {
        }
        return isValid;
      });

    return result;
  };

  return {
    smjestaji,
    currentSmjestaj,
    sadrzaji,
    isLoading,
    error,
    fetchSmjestaji,
    fetchSmjestajiByRegija,
    fetchSmjestajiByTip,
    fetchSmjestaj,
    fetchSmjestajBySlug,
    fetchSmjestajSadrzajiRelations,
    fetchSadrzaji,
    formatPrice,
    formatPriceHRK,
    getThumbnailUrl,
    getFullAddress,
    hasAmenity,
    getSadrzajIconUrl,
    getSmjestajSadrzaji,
  };
};
