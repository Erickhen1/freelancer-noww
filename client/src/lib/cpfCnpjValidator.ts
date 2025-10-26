/**
 * Remove caracteres não numéricos
 */
export function cleanDocument(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Formata CPF: 000.000.000-00
 */
export function formatCPF(value: string): string {
  const cleaned = cleanDocument(value);
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return value;
}

/**
 * Formata CNPJ: 00.000.000/0000-00
 */
export function formatCNPJ(value: string): string {
  const cleaned = cleanDocument(value);
  return cleaned
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Formata automaticamente CPF ou CNPJ baseado no tamanho
 */
export function formatCPFOrCNPJ(value: string): string {
  const cleaned = cleanDocument(value);
  
  if (cleaned.length <= 11) {
    return formatCPF(value);
  } else {
    return formatCNPJ(value);
  }
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanDocument(cpf);
  
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder >= 10 ? 0 : remainder;
  
  if (digit1 !== parseInt(cleaned.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder >= 10 ? 0 : remainder;
  
  return digit2 === parseInt(cleaned.charAt(10));
}

/**
 * Valida CNPJ
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cleanDocument(cnpj);
  
  if (cleaned.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let length = cleaned.length - 2;
  let numbers = cleaned.substring(0, length);
  const digits = cleaned.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Validação do segundo dígito verificador
  length = length + 1;
  numbers = cleaned.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
}

/**
 * Valida CPF ou CNPJ automaticamente
 */
export function validateCPFOrCNPJ(value: string): { valid: boolean; type: 'CPF' | 'CNPJ' | null; message: string } {
  const cleaned = cleanDocument(value);
  
  if (cleaned.length === 0) {
    return { valid: false, type: null, message: 'Campo obrigatório' };
  }
  
  if (cleaned.length === 11) {
    const isValid = validateCPF(value);
    return {
      valid: isValid,
      type: 'CPF',
      message: isValid ? 'CPF válido' : 'CPF inválido'
    };
  } else if (cleaned.length === 14) {
    const isValid = validateCNPJ(value);
    return {
      valid: isValid,
      type: 'CNPJ',
      message: isValid ? 'CNPJ válido' : 'CNPJ inválido'
    };
  } else {
    return {
      valid: false,
      type: null,
      message: 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido'
    };
  }
}

