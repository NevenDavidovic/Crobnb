import type { SearchFilters } from "~/types/pages/search-filter";

export function useFilter() {
  const route = useRoute();

  const onSearch = (filters: SearchFilters): void => {
    const queryParams: Record<string, string> = {
      location: filters.location,
      type: filters.type,
      checkin: filters.checkin,
      checkout: filters.checkout,
      adults: filters.adults,
      children: filters.children,
    };

    navigateTo({
      path: "/smjestaji",
      query: queryParams,
    });
  };

  const getUrlParams = () => {
    const params = {
      location: (route.query.location as string) || null,
      type: (route.query.type as string) || null,
      checkin: (route.query.checkin as string) || null,
      checkout: (route.query.checkout as string) || null,
      adults: route.query.adults ? parseInt(route.query.adults as string) : 2,
      children: route.query.children
        ? parseInt(route.query.children as string)
        : 0,
    };

    return params;
  };

  const urlParams = ref(getUrlParams());

  watch(
    () => route.query,
    () => {
      urlParams.value = getUrlParams();
    },
    { deep: true }
  );

  return {
    onSearch,
    urlParams,
  };
}
