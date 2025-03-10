import type { DirectusFile } from "./base";

export interface TipSmjestaja {
  id: number;
  naziv: string;
  ikona: DirectusFile | null;
  kratki_opis?: string;
  slug?: string;
}
