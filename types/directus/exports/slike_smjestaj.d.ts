import type { DirectusFile } from "./base";
import type { Smjestaj } from "./smjestaj";

// First, let's add the missing interface for slike_smjestaj
export interface SlikaSmjestaj {
  id: number;
  smjestaj_id: number;
  slika: DirectusFile | null;
}
