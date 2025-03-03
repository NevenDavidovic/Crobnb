import type { DirectusFile } from "./base";

export interface Regija {
  id: number;
  naziv: string;
  kratki_opis: string;
  opis: string;
  slika: DirectusFile | null;
  slug?: string;
}
