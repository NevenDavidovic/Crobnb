export interface DirectusUser {
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

  telefon?: string | null;
}

export interface AuthResponse {
  access_token: string;
  expires: number;
  refresh_token?: string;
  user?: DirectusUser;
}
