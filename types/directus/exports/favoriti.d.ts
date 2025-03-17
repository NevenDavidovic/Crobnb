import type {
  Smjestaj,
  Thumbnail,
  Regija,
  TipSmjestaja,
  Sadrzaji,
} from "~/types/directus/exports/all_data_smjestaj_interface";

export interface Favoriti {
  id: number;
  user_id: string;
  smjestaj_id: number;
  smjestaj?: Smjestaj & {
    thumbnail?: Thumbnail;
    regija?: Regija;
    tip_smjestaja?: TipSmjestaja;
    sadrzaji?: {
      sadrzaj: Sadrzaji;
    }[];
  };
}
