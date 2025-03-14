import { HistoricoService } from "./service";

export function makeService() {
    const service = new HistoricoService()
    return service;
}