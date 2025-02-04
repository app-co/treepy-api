export class UserAlredyExist extends Error {
  constructor() {
    super('E-mail alredy exists');
  }
}
