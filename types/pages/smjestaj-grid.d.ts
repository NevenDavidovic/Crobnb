import type { Smjestaj } from "~/types/directus/index";

export interface SmjestajGridProps {
  smjestaji: Smjestaj[];
  isLoading: boolean;
  error: string | null;
  getThumbnailUrl: (smjestaj: Smjestaj) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
  getSadrzajIconUrl: (sadrzaj: Sadrzaj) => string | null;
}
