import type { SmjestajWithRelations } from "~/types/directus/index";

export const usePriceRange = (allSmjestaji: Ref<SmjestajWithRelations[]>) => {
  const priceMin = ref(0);
  const priceMax = computed(() => {
    if (allSmjestaji.value.length === 0) return 240;

    return Math.ceil(
      Math.max(
        ...allSmjestaji.value.map(
          (item: { cijena_nocenja: number }) => item.cijena_nocenja || 0
        )
      )
    );
  });

  const currentPriceMin = ref(0);
  const currentPriceMax = ref(0);
  const dragType = ref<"min" | "max" | null>(null);

  const updatePriceRange = () => {
    currentPriceMax.value = priceMax.value;
  };

  const sliderMinPercent = computed(
    () => (currentPriceMin.value / priceMax.value) * 100
  );

  const sliderMaxPercent = computed(
    () => (currentPriceMax.value / priceMax.value) * 100
  );

  const sliderWidth = computed(
    () => sliderMaxPercent.value - sliderMinPercent.value
  );

  const startDrag = (type: "min" | "max", event: MouseEvent | TouchEvent) => {
    dragType.value = type;

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);

    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", stopDrag);
    document.addEventListener("touchcancel", stopDrag);

    event.preventDefault();
  };

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!dragType.value) return;

    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;

    const slider = (
      "touches" in event ? event.target : event.target
    ) as HTMLElement;
    const sliderRect = slider.parentElement?.getBoundingClientRect();
    if (!sliderRect) return;

    const offsetX = clientX - sliderRect.left;
    const percent = Math.min(Math.max(0, offsetX / sliderRect.width), 1);
    const newValue = Math.round(percent * priceMax.value);

    if (dragType.value === "min") {
      currentPriceMin.value = Math.min(newValue, currentPriceMax.value - 10);
    } else {
      currentPriceMax.value = Math.max(newValue, currentPriceMin.value + 10);
    }
  };

  const stopDrag = () => {
    dragType.value = null;

    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);

    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", stopDrag);
    document.removeEventListener("touchcancel", stopDrag);
  };

  return {
    priceMin,
    priceMax,
    currentPriceMin,
    currentPriceMax,
    dragType,
    sliderMinPercent,
    sliderMaxPercent,
    sliderWidth,
    updatePriceRange,
    startDrag,
    handleDrag,
    stopDrag,
  };
};
