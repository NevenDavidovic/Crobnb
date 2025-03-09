// In types/pages/smjestaj-card.ts
import type {
  Smjestaj,
  Sadrzaj,
  SmjestajWithRelations,
} from "~/types/directus/index";

export interface SmjestajCardProps {
  smjestaj: SmjestajWithRelations;
  getThumbnailUrl: (
    smjestaj: SmjestajWithRelations | Smjestaj
  ) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
  getSadrzajIconUrl: ((sadrzaj: Sadrzaj) => string | null) | null;
}
