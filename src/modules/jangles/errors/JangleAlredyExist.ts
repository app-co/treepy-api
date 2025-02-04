export class JangleAlredyExist extends Error {
  constructor() {
    super('Já existe uma floresta cadastrada com o mesmo código');
  }
}
