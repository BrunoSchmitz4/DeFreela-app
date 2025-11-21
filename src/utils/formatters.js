/**
 * Formata valor monetário para Real Brasileiro
 * @param {number} value - Valor numérico
 * @returns {string} - Valor formatado (ex: R$ 1.500,00)
 */
export function formatCurrency(value) {
  if (!value && value !== 0) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata data para padrão brasileiro
 * @param {string|Date} date - Data ISO ou objeto Date
 * @returns {string} - Data formatada (ex: 20/11/2025)
 */
export function formatDate(date) {
  if (!date) return '—';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '—';
  
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata data e hora
 * @param {string|Date} date - Data ISO ou objeto Date
 * @returns {string} - Data formatada (ex: 20/11/2025 14:30)
 */
export function formatDateTime(date) {
  if (!date) return '—';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '—';
  
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formata data para input[type="date"]
 * @param {string|Date} date 
 * @returns {string} - YYYY-MM-DD
 */
export function formatDateForInput(date) {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Formata CPF (000.000.000-00)
 * @param {string} cpf 
 * @returns {string}
 */
export function formatCPF(cpf) {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return cpf;
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ (00.000.000/0000-00)
 * @param {string} cnpj 
 * @returns {string}
 */
export function formatCNPJ(cnpj) {
  if (!cnpj) return '';
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return cnpj;
  
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ automaticamente
 * @param {string} doc 
 * @returns {string}
 */
export function formatDocument(doc) {
  if (!doc) return '';
  
  const cleaned = doc.replace(/\D/g, '');
  
  if (cleaned.length === 11) return formatCPF(cleaned);
  if (cleaned.length === 14) return formatCNPJ(cleaned);
  
  return doc;
}

/**
 * Formata telefone brasileiro
 * @param {string} phone 
 * @returns {string} - (00) 00000-0000
 */
export function formatPhone(phone) {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Calcula diferença de dias entre duas datas
 * @param {string|Date} date1 
 * @param {string|Date} date2 
 * @returns {number} - Dias de diferença
 */
export function getDaysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Verifica se data está vencida
 * @param {string|Date} date 
 * @returns {boolean}
 */
export function isOverdue(date) {
  if (!date) return false;
  
  const deadline = new Date(date);
  const today = new Date();
  
  // zera horas para comparar só a data
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  
  return deadline < today;
}

/**
 * Verifica se prazo está próximo (menos de 3 dias)
 * @param {string|Date} date 
 * @returns {boolean}
 */
export function isDeadlineNear(date) {
  if (!date) return false;
  
  const deadline = new Date(date);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  
  const diffDays = getDaysDifference(today, deadline);
  
  return diffDays <= 3 && deadline >= today;
}

/**
 * Trunca texto longo
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Gera iniciais de um nome
 * @param {string} name 
 * @returns {string} - ex: "João Silva" → "JS"
 */
export function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Converte bytes para formato legível
 * @param {number} bytes 
 * @returns {string} - ex: "1.5 MB"
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calcula progresso percentual
 * @param {number} completed 
 * @param {number} total 
 * @returns {number} - percentual (0-100)
 */
export function calculateProgress(completed, total) {
  if (!total || total === 0) return 0;
  
  return Math.round((completed / total) * 100);
}

/**
 * Capitaliza primeira letra
 * @param {string} text 
 * @returns {string}
 */
export function capitalize(text) {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Remove acentos
 * @param {string} text 
 * @returns {string}
 */
export function removeAccents(text) {
  if (!text) return '';
  
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Formata número com separador de milhares
 * @param {number} num 
 * @returns {string}
 */
export function formatNumber(num) {
  if (!num && num !== 0) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(num);
}