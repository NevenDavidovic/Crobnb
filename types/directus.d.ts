export interface TipSmjestaja {
  id: number;
  naziv: string;
  ikona: DirectusFile | null;
  slug?: string;
}

export interface Regija {
  id: number;
  naziv: string;
  kratki_opis: string;
  opis: string;
  slika: DirectusFile | null;
  slug?: string;
}

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

export interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string | null;
  uploaded_by: string | null;
  uploaded_on: string;
  modified_by: string | null;
  modified_on: string;
  charset: string | null;
  filesize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string[] | null;
  metadata: Record<string, any> | null;
}
