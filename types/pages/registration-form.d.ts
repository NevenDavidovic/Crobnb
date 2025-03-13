export interface FormData {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  lozinka: string;
  potvrdiLozinku: string;
  [key: string]: string; // Add index signature
}

export interface FormErrors {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  lozinka: string;
  potvrdiLozinku: string;
  [key: string]: string;
}

export interface PhoneValidationResult {
  isValid: boolean;
  number: string;
  country: {
    name: string;
    iso2: string;
    dialCode: string;
  };
  formatted: string;
}
