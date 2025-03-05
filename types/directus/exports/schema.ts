import type { DirectusFile } from "./base";
import type { TipSmjestaja } from "./accommodation";
import type { Regija } from "./regions";
import type { Novost, KategorijaNovosti } from "./news";
import type { Smjestaj, Sadrzaj, SmjestajSadrzaj } from "./smjestaj";
// import type { Rezervacija } from "./rezervacije";

/**
 * Define the schema for Directus collections
 * This helps TypeScript understand the available collections and their types
 */
export interface Schema {
  // Define your collections here
  tipovi_smjestaja: TipSmjestaja[];
  regija: Regija[];
  novosti: Novost[];
  kategorija_novosti: KategorijaNovosti[];
  smjestaj: Smjestaj[];
  sadrzaji: Sadrzaj[];
  smjestaj_sadrzaji: SmjestajSadrzaj[];
  //rezervacije: Rezervacija[];
  // Single items
  tipovi_smjestaja_items: {
    tipovi_smjestaja: TipSmjestaja;
  };
  regija_items: {
    regija: Regija;
  };
  novosti_items: {
    novosti: Novost;
  };
  kategorija_novosti_items: {
    kategorija_novosti: KategorijaNovosti;
  };
  smjestaj_items: {
    smjestaj: Smjestaj;
  };
  sadrzaji_items: {
    sadrzaji: Sadrzaj;
  };
  // rezervacije_items: {
  //rezervacije: Rezervacija;
  // };

  // Files
  directus_files: DirectusFile;
}
