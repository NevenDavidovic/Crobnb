import type { DirectusFile } from "./base";
import type { Smjestaj } from "./smjestaj";

export interface SmjestajWithRelations
  extends Omit<Smjestaj, "regija" | "tip_smjestaja" | "sadrzaji"> {
  regija: {
    id: number;
    naziv: string;
    kratki_opis: string;
    opis: string;
    slika: DirectusFile;
    slug?: string;
  };

  tip_smjestaja: {
    id: number;
    naziv: string;
    ikona: DirectusFile;
    slug?: string;
  };

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

  slike_smjestaj: Array<{
    id: number;
    smjestaj_id: number;
    slika: DirectusFile;
  }>;

  rezervacije: Array<{
    id: number;
    datum_od: string;
    datum_do: string;
    smjestaj_id: number;
  }>;
}

export interface SingleSmjestajResponse {
  data: SmjestajWithRelations;
}

export interface MultipleSmjestajResponse {
  data: SmjestajWithRelations[];
  meta?: {
    filter_count?: number;
    total_count?: number;
  };
}
