export class InvalidCredentials extends Error {
  constructor() {
    super('Suas credenciais estão incorretas, verefique os campos e tente novamente');
  }
}
