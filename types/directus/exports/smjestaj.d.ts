import type { DirectusFile } from "./base";
import type { Regija } from "./regions";
import type { TipSmjestaja } from "./accommodation";

export interface Sadrzaj {
  id: number;
  naziv: string;
  icon: string | DirectusFile;
}

export interface SmjestajSadrzaj {
  id: number;
  sadrzaj_id: number;
  smjestaj_id: number;
  sadrzaj?: Sadrzaj;
}

export interface Smjestaj {
  smjestaj_id: number | null;
  smjestaj_id: any;
  id: number;
  date_created: string;
  date_updated: string;
  naziv: string;
  adresa: string;
  postanski_broj: string;
  grad: string;
  cijena_nocenja: number;
  check_in: string;
  check_out: string;
  broj_zvjezdica: number;
  max_broj_gostiju: number;
  thumbnail: DirectusFile | null;
  regija_id: number;
  tipovi_smjestaja_id: number;
  boravisna_pristojba: number;
  details_opis: string;
  kratki_opis: string;
  broj_kreveta: number;
  broj_kupaonica: number;
  slug: string;

  // Relations
  regija?: Regija;
  tip_smjestaja?: TipSmjestaja;
  sadrzaji?: SmjestajSadrzaj[] | null;
}
