export interface SwiperInstance {
  slides: {
    length: number;
    [key: string]: any;
  };
  activeIndex: number;
  slideTo: (index: number, speed?: number, runCallbacks?: boolean) => void;
  slideNext: (speed?: number, runCallbacks?: boolean) => void;
  slidePrev: (speed?: number, runCallbacks?: boolean) => void;
  [key: string]: any;
}
