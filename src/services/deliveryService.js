import api from "./api";

/**
 * Lista entregas de uma tarefa
 * @param {number} taskId 
 * @returns {Promise}
 */
export async function getDeliveriesByTask(taskId) {
  const res = await api.get(`/tasks/${taskId}/deliveries`);
  return res.data; // { data: [...] }
}

/**
 * Busca entrega por ID
 * @param {number} id 
 * @returns {Promise}
 */
export async function getDeliveryById(id) {
  const res = await api.get(`/deliveries/${id}`);
  return res.data; // { data: delivery }
}

/**
 * Cria nova entrega
 * @param {number} taskId 
 * @param {object} payload - { arquivo_url, observacoes }
 * @returns {Promise}
 */
export async function createDelivery(taskId, payload) {
  const res = await api.post(`/tasks/${taskId}/deliveries`, payload);
  return res.data; // { data: delivery }
}

/**
 * Atualiza entrega
 * @param {number} id 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function updateDelivery(id, payload) {
  const res = await api.patch(`/deliveries/${id}`, payload);
  return res.data; // { data: delivery }
}

/**
 * Aprova entrega
 * @param {number} id 
 * @param {number} aprovadorId 
 * @returns {Promise}
 */
export async function approveDelivery(id, aprovadorId) {
  return updateDelivery(id, {
    status: 'APROVADA',
    aprovado_em: new Date().toISOString(),
    aprovado_por: aprovadorId
  });
}

/**
 * Reprova entrega
 * @param {number} id 
 * @param {string} motivo 
 * @returns {Promise}
 */
export async function rejectDelivery(id, motivo) {
  return updateDelivery(id, {
    status: 'REJEITADA',
    observacoes: motivo
  });
}

/**
 * Solicita revisão
 * @param {number} id 
 * @param {string} feedback 
 * @returns {Promise}
 */
export async function requestRevision(id, feedback) {
  return updateDelivery(id, {
    status: 'REVISAO_NECESSARIA',
    observacoes: feedback
  });
}

/**
 * Busca entregas do freelancer
 * @param {number} freelancerId 
 * @returns {Promise}
 */
export async function getDeliveriesByFreelancer(freelancerId) {
  const res = await api.get(`/freelancers/${freelancerId}/deliveries`);
  return res.data; // { data: [...] }
}

/**
 * Busca entregas por status
 * @param {string} status 
 * @returns {Promise}
 */
export async function getDeliveriesByStatus(status) {
  const res = await api.get(`/deliveries`, {
    params: { status }
  });
  return res.data; // { data: [...] }
}

/**
 * Deleta entrega
 * @param {number} id 
 * @returns {Promise}
 */
export async function deleteDelivery(id) {
  const res = await api.delete(`/deliveries/${id}`);
  return res.status === 204 ? { success: true } : res.data;
}

/**
 * Upload de arquivo (caso precise de endpoint específico)
 * @param {File} file 
 * @returns {Promise<string>} - URL do arquivo
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data.url; // retorna URL do arquivo
}