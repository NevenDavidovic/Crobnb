import { defineNuxtPlugin } from "#app";
import { createDirectusClient } from "~/utils/directus/client";
import { SmjestajService } from "~/utils/directus/services/smjestaj";
import { RegijeService } from "~/utils/directus/services/regije";
import { NovostiService } from "~/utils/directus/services/novosti";
import type { DirectusFile } from "~/types/directus";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;

  // Create Directus client with schema type
  const directus = createDirectusClient(directusUrl);

  // Create utility function for file URLs
  const getFileUrl = (fileId: string | DirectusFile | null): string | null => {
    if (!fileId) return null;

    if (typeof fileId === "string") {
      return `${directusUrl}/assets/${fileId}`;
    }

    if (fileId && typeof fileId === "object" && "id" in fileId && fileId.id) {
      return `${directusUrl}/assets/${fileId.id}`;
    }

    return null;
  };

  return {
    provide: {
      // Provide raw Directus client
      directus,

      // TipoviSmjestaja methods
      getTipoviSmjestaja: () => SmjestajService.getTipoviSmjestaja(directus),
      getTipSmjestaja: (id: number) =>
        SmjestajService.getTipSmjestaja(directus, id),
      getTipSmjestajaBySlug: (slug: string) =>
        SmjestajService.getTipSmjestajaBySlug(directus, slug),

      // Regija methods
      getRegije: () => RegijeService.getRegije(directus),
      getRegija: (id: number) => RegijeService.getRegija(directus, id),
      getRegijaBySlug: (slug: string) =>
        RegijeService.getRegijaBySlug(directus, slug),

      // Novosti methods
      getNovosti: (limit?: number) =>
        NovostiService.getNovosti(directus, limit),
      getNovost: (id: number) => NovostiService.getNovost(directus, id),
      getNovostiByKategorija: (kategorijaId: number, limit?: number) =>
        NovostiService.getNovostiByKategorija(directus, kategorijaId, limit),
      getNovostBySlug: (slug: string) =>
        NovostiService.getNovostBySlug(directus, slug),
      getKategorijeNovosti: () => NovostiService.getKategorijeNovosti(directus),

      // Utility methods
      getFileUrl,
    },
  };
});
