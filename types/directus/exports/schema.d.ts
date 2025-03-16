// Update to schema.d.ts
import type { DirectusFile } from "./base";
import type { TipSmjestaja } from "./accommodation";
import type { Regija } from "./regions";
import type { Novost, KategorijaNovosti } from "./news";
import type { Smjestaj, Sadrzaj, SmjestajSadrzaj } from "./smjestaj";
import type { Rezervacija } from "./rezervacije";
import type { SlikaSmjestaj } from "./slike_smjestaj";
import type { DirectusUser } from "./users";
import type {
  SmjestajWithRelations,
  SingleSmjestajResponse,
  MultipleSmjestajResponse,
} from "./all_data_smjestaj_interface";
import type { SadrzajActual } from "./sadrzaj_clone";
import type { SmjestajCardData } from "../../pages/smjestaj_by_regija";

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
  rezervacije: Rezervacija[];
  slike_smjestaj: SlikaSmjestaj[];
  sadrzaj: SadrzajActual[];
  directus_users: DirectusUser[];
  upiti_za_rezervaciju: UpitZaRezervaciju[];

  // Response types
  smjestaj_with_relations: SmjestajWithRelations;
  smjestaj_single_response: SingleSmjestajResponse;
  smjestaj_multiple_response: MultipleSmjestajResponse;

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
  rezervacije_items: {
    rezervacije: Rezervacija;
  };
  slike_smjestaj_items: {
    slike_smjestaj: SlikaSmjestaj;
  };

  // Single item for SmjestajWithRelations
  smjestaj_with_relations_item: {
    smjestaj_with_relations: SmjestajWithRelations;
  };

  // Files
  directus_files: DirectusFile;
}
