export class CpfAlredyExisteError extends Error {
  constructor() {
    super('CPF já cadastrado');
  }
}
