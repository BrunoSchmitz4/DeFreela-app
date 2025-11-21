import api from "./api";

/**
 * Lista tarefas de uma atividade
 * @param {number} activityId 
 * @returns {Promise}
 */
export async function getTasksByActivity(activityId) {
  const res = await api.get(`/activities/${activityId}/tasks`);
  return res.data; // { data: [...] }
}

/**
 * Busca tarefa por ID
 * @param {number} id 
 * @returns {Promise}
 */
export async function getTaskById(id) {
  const res = await api.get(`/tasks/${id}`);
  return res.data; // { data: task }
}

/**
 * Cria nova tarefa
 * @param {number} activityId 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function createTask(activityId, payload) {
  const res = await api.post(`/activities/${activityId}/tasks`, payload);
  return res.data; // { data: task }
}

/**
 * Atualiza tarefa
 * @param {number} id 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function updateTask(id, payload) {
  const res = await api.patch(`/tasks/${id}`, payload);
  return res.data; // { data: task }
}

/**
 * Deleta tarefa
 * @param {number} id 
 * @returns {Promise}
 */
export async function deleteTask(id) {
  const res = await api.delete(`/tasks/${id}`);
  return res.status === 204 ? { success: true } : res.data;
}

/**
 * Atribui freelancer a tarefa
 * @param {number} taskId 
 * @param {number} freelancerId 
 * @returns {Promise}
 */
export async function assignFreelancer(taskId, freelancerId) {
  return updateTask(taskId, { freelancer_id: freelancerId });
}

/**
 * Muda status da tarefa
 * @param {number} taskId 
 * @param {string} newStatus 
 * @returns {Promise}
 */
export async function changeTaskStatus(taskId, newStatus) {
  return updateTask(taskId, { status: newStatus });
}

/**
 * Busca tarefas do freelancer (todos os projetos)
 * @param {number} freelancerId 
 * @returns {Promise}
 */
export async function getTasksByFreelancer(freelancerId) {
  const res = await api.get(`/freelancers/${freelancerId}/tasks`);
  return res.data; // { data: [...] }
}

/**
 * Busca tarefas por status
 * @param {string} status 
 * @returns {Promise}
 */
export async function getTasksByStatus(status) {
  const res = await api.get(`/tasks`, {
    params: { status }
  });
  return res.data; // { data: [...] }
}

/**
 * Busca tarefas atrasadas
 * @returns {Promise}
 */
export async function getOverdueTasks() {
  const res = await api.get(`/tasks/overdue`);
  return res.data; // { data: [...] }
}