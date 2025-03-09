import type { DirectusFile } from "./base";
import type { Smjestaj } from "./smjestaj";

// Main interface for accommodation with all relations
export interface SmjestajWithRelations
  extends Omit<Smjestaj, "regija" | "tip_smjestaja" | "sadrzaji"> {
  // Override the basic relations with their full structures
  // regija comes with its slika (image)
  regija: {
    id: number;
    naziv: string;
    kratki_opis: string;
    opis: string;
    slika: DirectusFile;
    slug?: string;
  };

  // tip_smjestaja comes with its ikona (icon)
  tip_smjestaja: {
    id: number;
    naziv: string;
    ikona: DirectusFile;
    slug?: string;
  };

  // sadrzaji (amenities) come from the junction table with the full sadrzaj data
  smjestaj_sadrzaji: Array<{
    id: number;
    smjestaj_id: number;
    sadrzaj_id: number;
    sadrzaj: {
      id: number;
      naziv: string;
      icon: DirectusFile;
    };
  }>;

  // slike_smjestaj (accommodation images)
  slike_smjestaj: Array<{
    id: number;
    smjestaj_id: number;
    slika: DirectusFile;
  }>;

  // rezervacije (reservations)
  rezervacije: Array<{
    id: number;
    datum_od: string;
    datum_do: string;
    smjestaj_id: number;
  }>;
}

// Response interface for a single accommodation
export interface SingleSmjestajResponse {
  data: SmjestajWithRelations;
}

// Response interface for multiple accommodations
export interface MultipleSmjestajResponse {
  data: SmjestajWithRelations[];
  meta?: {
    filter_count?: number;
    total_count?: number;
  };
}
