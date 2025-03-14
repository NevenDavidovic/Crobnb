// ~/types/pages/directus-user-response.ts
export interface DirectusUserResponse {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  location: string | null;
  title: string | null;
  description: string | null;
  tags: any[] | null;
  avatar:
    | {
        id: string;
        // ostala polja datoteke ako su ti potrebna
      }
    | string
    | null;
  language: string | null;
  appearance: "auto" | "light" | "dark" | null;
  theme_light: string | null;
  theme_dark: string | null;
  theme_light_overrides: Record<string, any> | null;
  theme_dark_overrides: Record<string, any> | null;
  tfa_secret: string | null;
  status: "draft" | "invited" | "active" | "suspended" | "archived";
  role:
    | {
        id: string;
        name: string;
        // ostala polja uloge ako su ti potrebna
      }
    | string
    | null;
  token: string | null;
  last_access: string | null;
  last_page: string | null;
  provider: string | null;
  external_identifier: string | null;
  auth_data: Record<string, any> | null;
  email_notifications: boolean | null;
  // Dodatna polja koja možda imaš u svom sustavu
  telefon?: string | null;
}
