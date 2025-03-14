import SESMailProvider from "@/shared/providers/emails/providers/implementations/SESMailProvider";
import HandleBars from "@/shared/providers/emails/templates/implementations/HandleBaars";
import { HistoricoService } from "../historico/service";
import { UserService } from "./service";

export function make() {
  const repoBars = new HandleBars();
  const mail = new SESMailProvider(repoBars);
  const history = new HistoricoService()

  const servies = new UserService(history, mail)

  return servies
}