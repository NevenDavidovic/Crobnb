import { defineNuxtPlugin } from "#app";
import { createDirectusClient } from "~/utils/directus/client";
import { SmjestajService } from "~/utils/directus/services/smjestaj";
import { SmjestajiService } from "~/utils/directus/services/smjestaji";
import { RegijeService } from "~/utils/directus/services/regije";
import { NovostiService } from "~/utils/directus/services/novosti";
import { RezervacijeService } from "~/utils/directus/services/rezervacije";
import { AuthService } from "~/utils/directus/services/auth";
import { UpitiService } from "~/utils/directus/services/upiti";
import { createUser, registerUser, readMe } from "@directus/sdk";
import { FavoritiService } from "~/utils/directus/services/favoriti";
import type { DirectusFile } from "~/types/directus/index";
import type { SearchFilters } from "~/types/pages/search-filter";
import type { UpitFormData } from "~/types/directus/exports/upit";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const directusUrl = config.public.directusUrl;
  const directus = createDirectusClient(directusUrl);

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
      directus,

      addFavorite: (userId: string, smjestajId: number) =>
        FavoritiService.addFavorite(directus, userId, smjestajId),

      getFavorites: (userId: string) =>
        FavoritiService.getFavorites(directus, userId),

      removeFavorite: (favoriteId: number) =>
        FavoritiService.removeFavorite(directus, favoriteId),

      createUpit: (upitData: UpitFormData) =>
        UpitiService.createUpit(directus, upitData),

      registerUser: (userData: {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        telefon?: string;
        role: string;
      }) => AuthService.registerUser(directus, userData),

      loginUser: (credentials: { email: string; password: string }) =>
        AuthService.loginUser(directus, credentials),

      logoutUser: (refreshToken?: string) =>
        AuthService.logoutUser(directus, refreshToken),

      refreshToken: (refreshToken?: string) =>
        AuthService.refreshToken(directus, refreshToken),

      resetPassword: (token: string, password: string) =>
        AuthService.resetPassword(directus, token, password),

      requestPasswordReset: (email: string, resetUrl?: string) =>
        AuthService.requestPasswordReset(directus, email, resetUrl),

      getCurrentUser: () => AuthService.getCurrentUser(directus),

      sdkRegisterUser: registerUser,
      sdkCreateUser: createUser,
      sdkReadMe: readMe,

      getSmjestajSadrzajiRelations: () =>
        SmjestajiService.getSmjestajSadrzajiRelations(directus),

      getTipoviSmjestaja: () => SmjestajService.getTipoviSmjestaja(directus),

      getTipSmjestaja: (id: number) =>
        SmjestajService.getTipSmjestaja(directus, id),

      getTipSmjestajaBySlug: (slug: string) =>
        SmjestajService.getTipSmjestajaBySlug(directus, slug),

      getRegije: () => RegijeService.getRegije(directus),

      getRegija: (id: number) => RegijeService.getRegija(directus, id),

      getRegijaBySlug: (slug: string) =>
        RegijeService.getRegijaBySlug(directus, slug),

      getNovosti: (limit?: number) =>
        NovostiService.getNovosti(directus, limit),

      getNovost: (id: number) => NovostiService.getNovost(directus, id),

      getNovostiByKategorija: (kategorijaId: number, limit?: number) =>
        NovostiService.getNovostiByKategorija(directus, kategorijaId, limit),

      getNovostBySlug: (slug: string) =>
        NovostiService.getNovostBySlug(directus, slug),

      getKategorijeNovosti: () => NovostiService.getKategorijeNovosti(directus),

      getSmjestaji: (limit?: number) =>
        SmjestajiService.getSmjestaji(directus, limit),

      getSmjestajiByCity: (city: string, limit?: number) =>
        SmjestajiService.getSmjestajiByCity(directus, city, limit),

      getSmjestaj: (id: number) => SmjestajiService.getSmjestaj(directus, id),

      getSmjestajiByRegija: (regijaId: number, limit?: number) =>
        SmjestajiService.getSmjestajiByRegija(directus, regijaId, limit),

      getSmjestajiByTip: (tipId: number, limit?: number) =>
        SmjestajiService.getSmjestajiByTip(directus, tipId, limit),

      getSmjestajBySlug: (slug: string) =>
        SmjestajiService.getSmjestajBySlug(directus, slug),

      getSadrzaji: () => SmjestajiService.getSadrzaji(directus),

      getRezervacije: (filters?: Partial<SearchFilters>) =>
        RezervacijeService.getRezervacije(directus, filters),

      getAvailableSmjestaji: (filters: SearchFilters) =>
        RezervacijeService.getAvailableSmjestaji(directus, filters),

      checkSmjestajAvailability: (
        smjestajId: number,
        checkin: string,
        checkout: string
      ) =>
        RezervacijeService.checkSmjestajAvailability(
          directus,
          smjestajId,
          checkin,
          checkout
        ),

      getCompleteSmjestaji: (limit?: number) =>
        SmjestajiService.getCompleteSmjestaji(directus, limit),

      getCompleteSmjestaj: (id: number) =>
        SmjestajiService.getCompleteSmjestaj(directus, id),

      getCompleteSmjestajBySlug: (slug: string) =>
        SmjestajiService.getCompleteSmjestajBySlug(directus, slug),

      getSlikeSmjestaja: (smjestajId: number) =>
        SmjestajiService.getSlikeSmjestaja(directus, smjestajId),

      getRezervacijeSmjestaja: (smjestajId: number) =>
        SmjestajiService.getRezervacijeSmjestaja(directus, smjestajId),

      provjeriDostupnost: (
        smjestajId: number,
        datumOd: string,
        datumDo: string
      ) =>
        SmjestajiService.provjeriDostupnost(
          directus,
          smjestajId,
          datumOd,
          datumDo
        ),

      getFileUrl,
    },
  };
});
