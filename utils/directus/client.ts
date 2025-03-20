// client.ts
import { createDirectus, rest, authentication } from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";
import { useCookie } from "#app";

export const createDirectusClient = (directusUrl: string) => {
  const client = createDirectus<Schema>(directusUrl)
    .with(rest())
    .with(authentication("json"));

  const accessToken = useCookie("directus_access_token");
  const refreshToken = useCookie("directus_refresh_token");

  if (accessToken.value) {
    try {
      const tokenData = JSON.parse(atob(accessToken.value.split(".")[1]));
      const expiration = tokenData.exp * 1000;
      const now = Date.now();

      if (now < expiration) {
        client.setToken(accessToken.value as string);
      } else {
        accessToken.value = null;
        refreshToken.value = null;
      }
    } catch (e) {
      accessToken.value = null;
      refreshToken.value = null;
    }
  }

  return client;
};
