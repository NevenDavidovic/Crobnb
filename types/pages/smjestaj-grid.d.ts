import type {
  Smjestaj,
  Sadrzaj,
  SmjestajWithRelations,
} from "~/types/directus/index";

export interface SmjestajGridProps {
  smjestaji: SmjestajWithRelations[];
  isLoading: boolean;
  error: string | null;
  getThumbnailUrl: (
    smjestaj: SmjestajWithRelations | Smjestaj
  ) => string | null;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
  getSadrzajIconUrl: (sadrzaj: Sadrzaj) => string | null;
  itemsPerPage?: number;
}
