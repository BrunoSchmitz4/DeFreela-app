import api from "./api";

/**
 * UC01 - Atribuir freelancer ao projeto
 * @param {number} projectId 
 * @param {object} payload - { freelancer_id, papel, valor_acordado }
 * @returns {Promise}
 */
export async function assignFreelancerToProject(projectId, payload) {
  const res = await api.post(`/projects/${projectId}/freelancers`, payload);
  return res.data; // { data: projeto_freelancer }
}

/**
 * UC01 - Listar freelancers do projeto
 * @param {number} projectId 
 * @returns {Promise}
 */
export async function getProjectFreelancers(projectId) {
  const res = await api.get(`/projects/${projectId}/freelancers`);
  return res.data; // { data: [projeto_freelancer] }
}

/**
 * UC01 - Atualizar atribuição do freelancer
 * @param {number} projectId 
 * @param {number} freelancerId 
 * @param {object} payload - { papel, valor_acordado }
 * @returns {Promise}
 */
export async function updateFreelancerAssignment(projectId, freelancerId, payload) {
  const res = await api.patch(
    `/projects/${projectId}/freelancers/${freelancerId}`, 
    payload
  );
  return res.data; // { data: projeto_freelancer }
}

/**
 * UC01 - Remover freelancer do projeto
 * @param {number} projectId 
 * @param {number} freelancerId 
 * @returns {Promise}
 */
export async function removeFreelancerFromProject(projectId, freelancerId) {
  const res = await api.delete(`/projects/${projectId}/freelancers/${freelancerId}`);
  return res.status === 204 ? { success: true } : res.data;
}

/**
 * UC01 - Verificar se freelancer já está no projeto
 * @param {number} projectId 
 * @param {number} freelancerId 
 * @returns {Promise<boolean>}
 */
export async function isFreelancerInProject(projectId, freelancerId) {
  try {
    const res = await getProjectFreelancers(projectId);
    return res.data.some(pf => pf.freelancer_id === freelancerId);
  } catch (err) {
    return false;
  }
}