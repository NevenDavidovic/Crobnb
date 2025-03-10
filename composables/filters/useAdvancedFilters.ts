import type { SmjestajWithRelations } from "~/types/directus/index";

export const useAdvancedFilters = (
  allSmjestaji: Ref<SmjestajWithRelations[]>,
  filteredSmjestaji: Ref<SmjestajWithRelations[]>,
  tipovi: Ref<any[]>,
  sadrzaji: Ref<any[]>,
  currentPriceMin: Ref<number>,
  currentPriceMax: Ref<number>,
  sortBy: Ref<string>,
  applySort: () => void,
  hasAmenity: (item: SmjestajWithRelations, amenityId: number) => boolean,
  updatePriceRange: () => void
) => {
  const isFilterVisible = ref(false);
  const selectedRegion = ref<number | null>(null);
  const selectedType = ref<number | null>(null);
  const selectedPriceRange = ref<string | null>(null);
  const checkinDate = ref<Date | null>(null);
  const checkoutDate = ref<Date | null>(null);
  const adults = ref<number>(2);
  const children = ref<number>(0);
  const selectedStars = ref<number[]>([]);
  const selectedAmenities = ref<number[]>([]);

  const isApartmanTypeSelected = computed(() => {
    const apartmanType = tipovi.value.find(
      (t: { naziv: string }) => t.naziv === "Apartman"
    );
    return apartmanType && selectedType.value === apartmanType.id;
  });

  const closeFilter = () => {
    isFilterVisible.value = false;
  };

  const showFilter = () => {
    isFilterVisible.value = true;
  };

  // Reset all filters
  const resetFilters = () => {
    selectedRegion.value = null;
    selectedType.value = null;

    selectedStars.value = [];
    selectedAmenities.value = [];
    checkinDate.value = null;
    checkoutDate.value = null;
    adults.value = 2;
    children.value = 0;

    // Reset currentPriceMin to 0
    updatePriceRange();

    navigateTo({
      path: "/smjestaji",
      query: {},
    });

    // Reset filteredSmjestaji to show all
    filteredSmjestaji.value = [...allSmjestaji.value];
  };

  // Toggle star rating filter
  const toggleStarRating = (stars: number) => {
    const index = selectedStars.value.indexOf(stars);
    if (index === -1) {
      selectedStars.value.push(stars);
    } else {
      selectedStars.value.splice(index, 1);
    }
  };

  // Get amenity ID by name
  const getAmenityIdByName = (name: string): number => {
    const amenity = sadrzaji.value.find(
      (s: { naziv: string }) => s.naziv.toLowerCase() === name.toLowerCase()
    );
    return amenity ? amenity.id : -1;
  };

  // Toggle amenity filter
  const toggleAmenity = (name: string) => {
    const amenityId = getAmenityIdByName(name);
    if (amenityId === -1) return;

    const index = selectedAmenities.value.indexOf(amenityId);
    if (index === -1) {
      selectedAmenities.value.push(amenityId);
    } else {
      selectedAmenities.value.splice(index, 1);
    }
  };

  // Toggle Apartman type
  const toggleApartmanType = () => {
    const apartmanType = tipovi.value.find(
      (t: { naziv: string }) => t.naziv === "Apartman"
    );
    if (!apartmanType) return;

    if (selectedType.value === apartmanType.id) {
      selectedType.value = null;
    } else {
      selectedType.value = apartmanType.id;
    }
  };

  const applyFilters = () => {
    let results = [...allSmjestaji.value];

    // First apply URL filters
    const route = useRoute();

    // Handle location filter - skip filtering if location is "sve"
    if (route.query.location && route.query.location !== "sve") {
      results = results.filter(
        (item) => item.regija && item.regija.slug === route.query.location
      );
    }

    // Handle type filter - skip filtering if type is "sve"
    if (route.query.type && route.query.type !== "sve") {
      results = results.filter(
        (item) =>
          item.tip_smjestaja && item.tip_smjestaja.slug === route.query.type
      );
    }

    if (route.query.adults || route.query.children) {
      const adults = route.query.adults
        ? parseInt(route.query.adults as string)
        : 0;
      const children = route.query.children
        ? parseInt(route.query.children as string)
        : 0;
      const totalGuests = adults + children;

      results = results.filter((item) => {
        const maxGuests = item.max_broj_gostiju || 0;
        return maxGuests >= totalGuests;
      });
    }

    if (route.query.checkin && route.query.checkout) {
      const checkinStr = route.query.checkin as string;
      const checkoutStr = route.query.checkout as string;

      const parseDate = (dateStr: string) => {
        const parts = dateStr.split(".");
        if (parts.length >= 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          return new Date(year, month, day);
        }
        return null;
      };

      const checkinDate = parseDate(checkinStr);
      const checkoutDate = parseDate(checkoutStr);

      if (checkinDate && checkoutDate) {
        // Set time to beginning of day for consistent comparison
        checkinDate.setHours(0, 0, 0, 0);
        checkoutDate.setHours(0, 0, 0, 0);

        results = results.filter((item) => {
          // If the accommodation has no reservations, it's available
          if (!item.rezervacije || item.rezervacije.length === 0) {
            return true;
          }

          // Check each reservation for overlap
          for (const reservation of item.rezervacije) {
            const reservationStart = new Date(reservation.datum_od);
            const reservationEnd = new Date(reservation.datum_do);

            // Set time to beginning of day for consistent comparison
            reservationStart.setHours(0, 0, 0, 0);
            reservationEnd.setHours(0, 0, 0, 0);

            // Create a date for the day before checkout (the last night of stay)
            const lastNight = new Date(checkoutDate);
            lastNight.setDate(lastNight.getDate() - 1);

            // Create a date for the day before reservation end
            const reservationLastNight = new Date(reservationEnd);
            reservationLastNight.setDate(reservationLastNight.getDate() - 1);

            // Check for overlap
            if (
              checkinDate <= reservationLastNight &&
              lastNight >= reservationStart
            ) {
              return false;
            }
          }

          // If no overlap with any reservation, the accommodation is available
          return true;
        });
      }
    }

    // Apply star rating filter
    if (selectedStars.value.length > 0) {
      results = results.filter((item) => {
        // Convert to number to ensure consistent comparison
        const stars = Number(item.broj_zvjezdica || 0);
        return selectedStars.value.includes(stars);
      });
    }

    if (selectedAmenities.value.length > 0) {
      results = results.filter((item) => {
        for (const amenityId of selectedAmenities.value) {
          if (!hasAmenity(item, amenityId)) {
            return false;
          }
        }
        return true;
      });
    }

    if (selectedType.value !== null) {
      results = results.filter(
        (item) => item.tipovi_smjestaja_id === selectedType.value
      );
    }

    results = results.filter((item) => {
      const price = item.cijena_nocenja;
      return price >= currentPriceMin.value && price <= currentPriceMax.value;
    });

    filteredSmjestaji.value = results;

    if (sortBy.value !== "default") {
      applySort();
    }
  };

  return {
    isFilterVisible,
    selectedRegion,
    selectedType,
    selectedPriceRange,
    checkinDate,
    checkoutDate,
    adults,
    children,
    selectedStars,
    selectedAmenities,
    isApartmanTypeSelected,

    closeFilter,
    showFilter,
    resetFilters,
    toggleStarRating,
    toggleAmenity,
    toggleApartmanType,
    getAmenityIdByName,
    applyFilters,
  };
};
