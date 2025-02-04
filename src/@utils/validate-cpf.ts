/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable radix */

export function _validarCPF(cpf: string) {
  // Remove os caracteres "." e "-" do CPF
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se o CPF possui 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Calcula o primeiro dígito verificador do CPF
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  // Calcula o segundo dígito verificador do CPF
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  // Verifica se os dígitos verificadores são válidos
  if (
    parseInt(cpf.charAt(9)) !== digito1 ||
    parseInt(cpf.charAt(10)) !== digito2
  ) {
    return false;
  }

  return true;
}

export function _validarCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]+/g, '');

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;

  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Cálculo dos dígitos verificadores
  const calcularDigito = (base: number[]) => {
    let soma = 0;
    let pos = base.length - 7;
    for (let i = 0; i < base.length; i++) {
      soma += base[i] * pos--;
      if (pos < 2) pos = 9;
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11);
  };

  // Separa os números e os dígitos verificadores
  const base = cnpj.slice(0, 12).split('').map(Number);
  const digitosVerificadores = cnpj.slice(12).split('').map(Number);

  // Verifica o primeiro dígito
  base.push(calcularDigito(base));
  if (base[12] !== digitosVerificadores[0]) return false;

  // Verifica o segundo dígito
  base.push(calcularDigito(base));
  if (base[13] !== digitosVerificadores[1]) return false;

  return true;
}
