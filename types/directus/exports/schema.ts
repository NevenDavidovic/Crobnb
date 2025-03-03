import type { DirectusFile } from "./base";
import type { TipSmjestaja } from "./accommodation";
import type { Regija } from "./regions";
import type { Novost, KategorijaNovosti } from "./news";

/**
 * Define the schema for Directus collections
 */
export interface Schema {
  // Collections
  tipovi_smjestaja: TipSmjestaja[];
  regija: Regija[];
  novosti: Novost[];
  kategorija_novosti: KategorijaNovosti[];

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

  // Files
  directus_files: DirectusFile;
}
