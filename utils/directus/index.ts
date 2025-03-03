import { createDirectusClient } from "./client";
import { SmjestajService } from "./services/smjestaj";
import { RegijeService } from "./services/regije";
import { NovostiService } from "./services/novosti";
import { getFileUrl } from "./utils";

// Export all services and utilities for easier imports
export {
  createDirectusClient,
  SmjestajService,
  RegijeService,
  NovostiService,
  getFileUrl,
};
