import type { Smjestaj } from "./smjestaj";

export interface Rezervacija {
  id: number;
  // Using string type for ISO date format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS"
  datum_od: string;
  datum_do: string;
  smjestaj_id: number;

  // Relation
  smjestaj?: Smjestaj;
}
