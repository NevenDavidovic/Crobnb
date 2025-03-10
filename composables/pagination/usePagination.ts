import { ref, computed } from "vue";

export const usePagination = <T>(
  items: Ref<T[]>,
  itemsPerPage: number = 10
) => {
  const currentPage = ref(1);
  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage);
  });

  // Get items for the current page
  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.value.slice(startIndex, endIndex);
  });

  // Navigate to specific page
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Navigate to next page
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1);
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1);
    }
  };

  // Get page numbers to display (with ellipsis for many pages)
  const displayedPages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;

    // If 7 or fewer pages, show all
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Always include first and last page
    const pages = [1, total];

    // Add ellipsis and surrounding pages
    if (current <= 3) {
      // Near the start
      return [1, 2, 3, 4, "...", total];
    } else if (current >= total - 2) {
      // Near the end
      return [1, "...", total - 3, total - 2, total - 1, total];
    } else {
      // Middle - show current and neighbors
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
