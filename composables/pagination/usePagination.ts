export const usePagination = <T>(
  items: Ref<T[]>,
  itemsPerPage: number = 10
) => {
  const currentPage = ref(1);
  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage);
  });

  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.value.slice(startIndex, endIndex);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1);
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1);
    }
  };

  const displayedPages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [1, total];

    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    } else if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    } else {
      return [1, "...", current - 1, current, current + 1, "...", total];
    }
  });

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    displayedPages,
  };
};
