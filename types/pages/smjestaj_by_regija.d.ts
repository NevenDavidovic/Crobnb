export interface SmjestajCardData {
  id: number;
  naziv: string;
  adresa: string;
  postanski_broj: string;
  grad: string;
  cijena_nocenja: number;
  thumbnail?: any;
  regija?: { naziv?: string };
  tip_smjestaja?: { naziv?: string };
  broj_zvjezdica?: number;
  slug?: string;
  smjestaj_sadrzaji?: Array<{
    sadrzaj?: {
      id: number;
      naziv: string;
      icon?: any;
    };
  }>;
}
