import type { SmjestajWithRelations } from "~/types/directus/index";

interface SmjestajDetailsProps {
  smjestaj: SmjestajWithRelations;
  formatPrice: (price: number) => string;
  formatPriceHRK: (price: number) => string;
  selectedDates: {
    checkin: Date;
    checkout: Date;
  };
  formatDate: (date: Date) => string;
}
