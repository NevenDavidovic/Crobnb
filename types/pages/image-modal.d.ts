export interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  imageAlt?: string;
}

// Type for component emits
export type ImageModalEmits = {
  close: [];
};
