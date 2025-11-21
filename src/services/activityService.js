import api from "./api";

/**
 * Lista atividades de um projeto
 * @param {number} projectId 
 * @returns {Promise}
 */
export async function getActivitiesByProject(projectId) {
  const res = await api.get(`/projects/${projectId}/activities`);
  return res.data; // { data: [...] }
}

/**
 * Cria nova atividade
 * @param {number} projectId 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function createActivity(projectId, payload) {
  const res = await api.post(`/projects/${projectId}/activities`, payload);
  return res.data; // { data: activity }
}

/**
 * Atualiza atividade
 * @param {number} id 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function updateActivity(id, payload) {
  const res = await api.patch(`/activities/${id}`, payload);
  return res.data; // { data: activity }
}

/**
 * Deleta atividade
 * @param {number} id 
 * @returns {Promise}
 */
export async function deleteActivity(id) {
  const res = await api.delete(`/activities/${id}`);
  return res.status === 204 ? { success: true } : res.data;
}

/**
 * Altera ordem da atividade
 * @param {number} id 
 * @param {number} novaOrdem 
 * @returns {Promise}
 */
export async function reorderActivity(id, novaOrdem) {
  return updateActivity(id, { ordem: novaOrdem });
}