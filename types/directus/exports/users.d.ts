export interface DirectusUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  location: string | null;
  title: string | null;
  description: string | null;
  avatar: string | null;
  language: string | null;
  theme: string | null;
  tfa_secret: string | null;
  status: string;
  role: string | null;
  token: string | null;
  last_page: string | null;
  last_access: string | null;
  provider: string | null;
  external_identifier: string | null;
  auth_data: any | null;
  email_notifications: boolean | null;
  appearance: string | null;
  theme_light: string | null;
  theme_light_overrides: any | null;
  theme_dark: string | null;
  theme_dark_overrides: any | null;
  telefon: string | null;
  tags: string[] | null;
  preferences_divider: boolean | null;
  theming_divider: boolean | null;
  admin_divider: boolean | null;
}

export interface AuthResponse {
  access_token: string;
  expires: number;
  refresh_token?: string;
  user?: DirectusUser;
}
