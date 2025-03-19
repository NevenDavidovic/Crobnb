// client.ts
import { createDirectus, rest, authentication } from "@directus/sdk";
import type { Schema } from "~/types/directus/exports/schema";
import { useCookie } from "#app";

export const createDirectusClient = (directusUrl: string) => {
  const client = createDirectus<Schema>(directusUrl)
    .with(rest())
    .with(authentication("json"));

  const accessToken = useCookie("directus_access_token");

  if (accessToken.value) {
    const route = useRoute();
    const publicRoutes = ["/home", "/", "/novosti", "/regije", "/smjestaj"];
    const isPublicRoute = publicRoutes.some((r) => route.path.startsWith(r));

    if (!isPublicRoute) {
      client.setToken(accessToken.value as string);
    }
  }

  return client;
};
