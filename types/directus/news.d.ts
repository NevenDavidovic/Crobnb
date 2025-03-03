import type { DirectusFile } from "./base";

export interface KategorijaNovosti {
  id: number;
  naziv: string;
}

export interface Novost {
  id: number;
  date_created: string;
  date_updated: string;
  naslov: string;
  kratki_opis: string;
  sadrzaj: string;
  hero_slika: DirectusFile | null;
  kategorija_novosti_id: number;
  kategorija_novosti?: KategorijaNovosti;
  slug?: string;
}
