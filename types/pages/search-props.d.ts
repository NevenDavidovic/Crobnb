import type { Regija } from "~/types/directus/index";
import type { TipSmjestaja } from "~/types/directus/index";

export interface SearchComponentProps {
  tipovi: TipSmjestaja[];
  tipoviLoading: boolean;
  tipoviError: string | null;
  regije: Regija[];
  regijeLoading: boolean;
  regijeError: string | null;
}
