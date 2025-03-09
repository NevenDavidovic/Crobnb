import type { Regija } from "~/types/directus/index";
import type { TipSmjestaja } from "~/types/directus/index";

export interface SearchComponentProps {
  tipovi: TipSmjestaja[];
  tipoviLoading: boolean;
  tipoviError: string;
  regije: Regija[];
  regijeLoading: boolean;
  regijeError: string;
  // Add the new prop definitions
  initialLocation?: string;
  initialType?: string;
  initialCheckin?: string;
  initialCheckout?: string;
  initialAdults?: number;
  initialChildren?: number;
  isVisible?: boolean;
}
