/**
 * Valida email
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida CPF
 * @param {string} cpf 
 * @returns {boolean}
 */
export function isValidCPF(cpf) {
  if (!cpf) return false;
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;
  
  if (parseInt(cleaned.charAt(9)) !== digit1) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;
  
  if (parseInt(cleaned.charAt(10)) !== digit2) return false;
  
  return true;
}

/**
 * Valida CNPJ
 * @param {string} cnpj 
 * @returns {boolean}
 */
export function isValidCNPJ(cnpj) {
  if (!cnpj) return false;
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  // Valida primeiro dígito verificador
  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Valida segundo dígito verificador
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}

/**
 * Valida CPF ou CNPJ
 * @param {string} document 
 * @returns {boolean}
 */
export function isValidDocument(document) {
  if (!document) return false;
  
  const cleaned = document.replace(/\D/g, '');
  
  if (cleaned.length === 11) return isValidCPF(cleaned);
  if (cleaned.length === 14) return isValidCNPJ(cleaned);
  
  return false;
}

/**
 * Valida telefone brasileiro
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Aceita 10 ou 11 dígitos (com ou sem 9 no celular)
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Valida URL
 * @param {string} url 
 * @returns {boolean}
 */
export function isValidUrl(url) {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida se campo não está vazio
 * @param {string} value 
 * @returns {boolean}
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  return true;
}

/**
 * Valida tamanho mínimo de string
 * @param {string} value 
 * @param {number} min 
 * @returns {boolean}
 */
export function minLength(value, min) {
  if (!value) return false;
  
  return value.length >= min;
}

/**
 * Valida tamanho máximo de string
 * @param {string} value 
 * @param {number} max 
 * @returns {boolean}
 */
export function maxLength(value, max) {
  if (!value) return true; // se vazio, não valida tamanho
  
  return value.length <= max;
}

/**
 * Valida se valor é número positivo
 * @param {number} value 
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Valida se data é futura
 * @param {string|Date} date 
 * @returns {boolean}
 */
export function isFutureDate(date) {
  if (!date) return false;
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= today;
}

/**
 * Valida se data é passada
 * @param {string|Date} date 
 * @returns {boolean}
 */
export function isPastDate(date) {
  if (!date) return false;
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate < today;
}

/**
 * Valida tamanho de arquivo
 * @param {File} file 
 * @param {number} maxSizeInBytes 
 * @returns {boolean}
 */
export function isValidFileSize(file, maxSizeInBytes = 10 * 1024 * 1024) {
  if (!file) return false;
  
  return file.size <= maxSizeInBytes;
}

/**
 * Valida tipo de arquivo
 * @param {File} file 
 * @param {string[]} allowedTypes 
 * @returns {boolean}
 */
export function isValidFileType(file, allowedTypes) {
  if (!file) return false;
  
  return allowedTypes.includes(file.type);
}

/**
 * Valida senha forte
 * @param {string} password 
 * @returns {boolean}
 */
export function isStrongPassword(password) {
  if (!password) return false;
  
  // Mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

/**
 * Valida se valor está dentro de um range
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export function isInRange(value, min, max) {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  
  return num >= min && num <= max;
}

/**
 * Valida formulário completo
 * @param {object} fields - { fieldName: { value, validators: [fn1, fn2] } }
 * @returns {object} - { isValid: boolean, errors: { fieldName: 'mensagem' } }
 */
export function validateForm(fields) {
  const errors = {};
  
  Object.keys(fields).forEach(fieldName => {
    const { value, validators } = fields[fieldName];
    
    if (!validators) return;
    
    for (const validator of validators) {
      const result = validator(value);
      
      if (!result.valid) {
        errors[fieldName] = result.message;
        break; // para no primeiro erro
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Validadores pré-configurados para usar com validateForm
export const validators = {
  required: (value) => ({
    valid: isRequired(value),
    message: 'Este campo é obrigatório'
  }),
  
  email: (value) => ({
    valid: isValidEmail(value),
    message: 'Email inválido'
  }),
  
  cpf: (value) => ({
    valid: isValidCPF(value),
    message: 'CPF inválido'
  }),
  
  cnpj: (value) => ({
    valid: isValidCNPJ(value),
    message: 'CNPJ inválido'
  }),
  
  document: (value) => ({
    valid: isValidDocument(value),
    message: 'CPF/CNPJ inválido'
  }),
  
  phone: (value) => ({
    valid: isValidPhone(value),
    message: 'Telefone inválido'
  }),
  
  url: (value) => ({
    valid: isValidUrl(value),
    message: 'URL inválida'
  }),
  
  positiveNumber: (value) => ({
    valid: isPositiveNumber(value),
    message: 'Deve ser um número positivo'
  }),
  
  futureDate: (value) => ({
    valid: !value || isFutureDate(value),
    message: 'Data deve ser futura'
  }),
  
  isFutureDate: (value) => ({
    valid: !value || isFutureDate(value),
    message: 'Data deve ser futura'
  }),
  
  minLength: (min) => (value) => ({
    valid: minLength(value, min),
    message: `Mínimo de ${min} caracteres`
  }),
  
  maxLength: (max) => (value) => ({
    valid: maxLength(value, max),
    message: `Máximo de ${max} caracteres`
  }),
  
  strongPassword: (value) => ({
    valid: isStrongPassword(value),
    message: 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número'
  })
};