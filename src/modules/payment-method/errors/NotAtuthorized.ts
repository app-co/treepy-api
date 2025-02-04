export class NotAtuthorized extends Error {
  constructor() {
    super(
      'Compra não autorizada. Verefique os dados do seu cartão ou consulte o seu banco ou tente novamente mais tarde',
    );
  }
}
