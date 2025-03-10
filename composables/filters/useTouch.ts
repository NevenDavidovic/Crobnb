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

    // If the user slides down more than 50px, close the modal
    if (slideDistance > 50) {
      modalRef.value = false;
    }

    // Reset values
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
