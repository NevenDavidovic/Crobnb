import { ref } from "vue";
import type { Smjestaj, Sadrzaj } from "~/types/directus";

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

  /**
   * Format price to display with currency
   * @param price Price in EUR
   * @returns Formatted price string
   */
  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} EUR`;
  };

  /**
   * Convert EUR to HRK (for display purposes)
   * @param priceEUR Price in EUR
   * @returns Price in HRK
   */
  const convertToHRK = (priceEUR: number): number => {
    // Fixed conversion rate (Euro to Croatian Kuna)
    const conversionRate = 7.5345;
    return priceEUR * conversionRate;
  };

  /**
   * Format price in HRK
   * @param priceEUR Price in EUR
   * @returns Formatted price in HRK
   */
  const formatPriceHRK = (priceEUR: number): string => {
    const priceHRK = convertToHRK(priceEUR);
    return `${priceHRK.toFixed(2)} HRK`;
  };

  /**
   * Fetch all accommodation listings
   * @param limit Maximum number of items to fetch
   */
  const fetchSmjestaji = async (limit?: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSmjestaji(limit);
      console.log("Raw smjestaji response:", response);

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
        broj_prijatelja: item.broj_prijatelja,
        max_broj_gostiju: item.max_broj_gostiju,
        thumbnail: item.thumbnail,
        regija_id: item.regija_id,
        smjestaj_id: item.smjestaj_id,
        boravimas_pristojba: item.boravimas_pristojba,
        detaljan_opis: item.detaljan_opis,
        kratki_opis: item.kratki_opis,
        broj_kreveta: item.broj_kreveta,
        broj_kupaonica: item.broj_kupaonica,
        slug: item.slug,
        broj_odraslih: item.broj_odraslih,
        broj_djece: item.broj_djece,
        regija: item.regija,
        tip_smjestaja: item.tip_smjestaja,
        sadrzaji: item.sadrzaji,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching smjestaji:", err);
      error.value = "Failed to load accommodation listings";
      isLoading.value = false;
    }
  };

  /**
   * Fetch accommodation listings by region
   * @param regijaId Region ID
   * @param limit Maximum number of items to fetch
   */
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
        broj_prijatelja: item.broj_prijatelja,
        max_broj_gostiju: item.max_broj_gostiju,
        thumbnail: item.thumbnail,
        regija_id: item.regija_id,
        smjestaj_id: item.smjestaj_id,
        boravimas_pristojba: item.boravimas_pristojba,
        detaljan_opis: item.detaljan_opis,
        kratki_opis: item.kratki_opis,
        broj_kreveta: item.broj_kreveta,
        broj_kupaonica: item.broj_kupaonica,
        slug: item.slug,
        broj_odraslih: item.broj_odraslih,
        broj_djece: item.broj_djece,
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

  /**
   * Fetch accommodation listings by type
   * @param tipId Accommodation type ID
   * @param limit Maximum number of items to fetch
   */
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
        broj_prijatelja: item.broj_prijatelja,
        max_broj_gostiju: item.max_broj_gostiju,
        thumbnail: item.thumbnail,
        regija_id: item.regija_id,
        smjestaj_id: item.smjestaj_id,
        boravimas_pristojba: item.boravimas_pristojba,
        detaljan_opis: item.detaljan_opis,
        kratki_opis: item.kratki_opis,
        broj_kreveta: item.broj_kreveta,
        broj_kupaonica: item.broj_kupaonica,
        slug: item.slug,
        broj_odraslih: item.broj_odraslih,
        broj_djece: item.broj_djece,
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

  /**
   * Fetch a single accommodation by ID
   * @param id Accommodation ID
   */
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
        broj_prijatelja: response.broj_prijatelja,
        max_broj_gostiju: response.max_broj_gostiju,
        thumbnail: response.thumbnail,
        regija_id: response.regija_id,
        smjestaj_id: response.smjestaj_id,
        boravimas_pristojba: response.boravimas_pristojba,
        detaljan_opis: response.detaljan_opis,
        kratki_opis: response.kratki_opis,
        broj_kreveta: response.broj_kreveta,
        broj_kupaonica: response.broj_kupaonica,
        slug: response.slug,
        broj_odraslih: response.broj_odraslih,
        broj_djece: response.broj_djece,
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

  /**
   * Fetch a single accommodation by slug
   * @param slug Accommodation slug
   */
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
          broj_prijatelja: response.broj_prijatelja,
          max_broj_gostiju: response.max_broj_gostiju,
          thumbnail: response.thumbnail,
          regija_id: response.regija_id,
          smjestaj_id: response.smjestaj_id,
          boravimas_pristojba: response.boravimas_pristojba,
          detaljan_opis: response.detaljan_opis,
          kratki_opis: response.kratki_opis,
          broj_kreveta: response.broj_kreveta,
          broj_kupaonica: response.broj_kupaonica,
          slug: response.slug,
          broj_odraslih: response.broj_odraslih,
          broj_djece: response.broj_djece,
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

  /**
   * Fetch all amenities
   */
  const fetchSadrzaji = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $getSadrzaji();

      sadrzaji.value = response.map((item: any) => ({
        id: item.id,
        naziv: item.naziv,
        ikona: item.ikona,
      }));

      isLoading.value = false;
    } catch (err) {
      console.error("Error fetching sadrzaji:", err);
      error.value = "Failed to load amenities";
      isLoading.value = false;
    }
  };

  /**
   * Get thumbnail URL for an accommodation
   * @param smjestaj Accommodation object
   * @returns URL for the thumbnail image or null
   */
  const getThumbnailUrl = (smjestaj: Smjestaj): string | null => {
    if (!smjestaj.thumbnail) return null;
    return $getFileUrl(smjestaj.thumbnail);
  };

  /**
   * Get full address string for an accommodation
   * @param smjestaj Accommodation object
   * @returns Full address string
   */
  const getFullAddress = (smjestaj: Smjestaj): string => {
    return `${smjestaj.adresa}, ${smjestaj.postanski_broj} ${smjestaj.grad}, ${
      smjestaj.regija?.naziv || "Hrvatska"
    }`;
  };

  /**
   * Check if an accommodation has a specific amenity
   * @param smjestaj Accommodation object
   * @param amenityId Amenity ID to check
   * @returns True if the accommodation has the amenity
   */
  const hasAmenity = (smjestaj: Smjestaj, amenityId: number): boolean => {
    if (!smjestaj.sadrzaji) return false;
    return smjestaj.sadrzaji.some(
      (item) =>
        item.sadrzaj_id === amenityId ||
        (item.sadrzaj && item.sadrzaj.id === amenityId)
    );
  };

  /**
   * Get icon URL for an amenity
   * @param sadrzaj Amenity object
   * @returns URL for the icon or null
   */
  const getSadrzajIconUrl = (sadrzaj: Sadrzaj | undefined): string | null => {
    if (!sadrzaj || !sadrzaj.ikona) return null;
    return $getFileUrl(sadrzaj.ikona);
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
    fetchSadrzaji,
    formatPrice,
    formatPriceHRK,
    getThumbnailUrl,
    getFullAddress,
    hasAmenity,
    getSadrzajIconUrl,
  };
};
