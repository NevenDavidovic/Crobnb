import type { Smjestaj } from "~/types/directus/index";

export interface SmjestajCardProps {
  smjestaj: Smjestaj;
  getThumbnailUrl: (smjestaj: Smjestaj) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
  getSadrzajIconUrl?: (sadrzaj: Sadrzaj) => string | null;
}
