export const useTouch = (modalRef: Ref<boolean>) => {
  const touchStartY = ref(0);
  const touchMoveY = ref(0);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.value = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent) => {
    touchMoveY.value = event.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const slideDistance = touchMoveY.value - touchStartY.value;
    if (slideDistance > 50) {
      modalRef.value = false;
    }

    touchStartY.value = 0;
    touchMoveY.value = 0;
  };

  return {
    touchStartY,
    touchMoveY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
