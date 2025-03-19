import type { SmjestajWithRelations } from "~/types/directus";

export const useSorting = (filteredSmjestaji: Ref<SmjestajWithRelations[]>) => {
  const showSortDropdown = ref(false);
  const sortBy = ref<string>("default");
  const showSortModal = ref(false);

  const sortOptions = [
    { label: "Cijena: niža prema višoj", value: "price-asc" },
    { label: "Cijena: viša prema nižoj", value: "price-desc" },
    { label: "Zvijezdice: niže prema višem", value: "stars-asc" },
    { label: "Zvijezdice: više prema nižem", value: "stars-desc" },
  ];

  const toggleSortDropdown = () => {
    showSortDropdown.value = !showSortDropdown.value;
  };

  const setSortOption = (option: string) => {
    sortBy.value = option;
    showSortDropdown.value = false;
    applySort();
  };

  const applySort = () => {
    const sortedResults = [...filteredSmjestaji.value];

    switch (sortBy.value) {
      case "price-asc":
        sortedResults.sort(
          (a, b) => (a.cijena_nocenja || 0) - (b.cijena_nocenja || 0)
        );
        break;
      case "price-desc":
        sortedResults.sort(
          (a, b) => (b.cijena_nocenja || 0) - (a.cijena_nocenja || 0)
        );
        break;
      case "stars-asc":
        sortedResults.sort(
          (a, b) => (a.broj_zvjezdica || 0) - (b.broj_zvjezdica || 0)
        );
        break;
      case "stars-desc":
        sortedResults.sort(
          (a, b) => (b.broj_zvjezdica || 0) - (a.broj_zvjezdica || 0)
        );
        break;
      default:
        break;
    }

    filteredSmjestaji.value = sortedResults;
  };

  const openSortModal = () => {
    showSortModal.value = true;
  };

  return {
    showSortDropdown,
    sortBy,
    sortOptions,
    showSortModal,
    toggleSortDropdown,
    setSortOption,
    applySort,
    openSortModal,
  };
};
