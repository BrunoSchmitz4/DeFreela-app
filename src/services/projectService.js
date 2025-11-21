import api from "./api";

/**
 * UC02 - Listar todos os projetos com busca
 * @param {string} search 
 * @returns {Promise}
 */
export async function getAllProjects(search = "") {
  const res = await api.get("/projects", {
    params: search ? { q: search } : {}
  });
  return res.data; // { data: [...] }
}

/**
 * UC02 - Buscar projeto por ID
 * @param {number} id 
 * @returns {Promise}
 */
export async function getProjectById(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data; // { data: project }
}

/**
 * UC02 - Criar novo projeto (com validações)
 * @param {object} payload 
 * @returns {Promise}
 */
export async function createProject(payload) {
  // Validações antes de enviar
  if (!payload.titulo || !payload.descricao) {
    throw new Error("Título e descrição são obrigatórios");
  }

  if (payload.orcamento_total && payload.orcamento_total <= 0) {
    throw new Error("Orçamento deve ser maior que zero");
  }

  if (payload.data_inicio && payload.data_fim_prevista) {
    const inicio = new Date(payload.data_inicio);
    const fim = new Date(payload.data_fim_prevista);
    
    if (fim <= inicio) {
      throw new Error("Data de fim deve ser posterior à data de início");
    }
  }

  const res = await api.post("/projects", payload);
  return res.data; // { data: project }
}

/**
 * UC02 - Atualizar projeto
 * @param {number} id 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function updateProject(id, payload) {
  // Validações antes de enviar
  if (payload.orcamento_total && payload.orcamento_total <= 0) {
    throw new Error("Orçamento deve ser maior que zero");
  }

  if (payload.data_inicio && payload.data_fim_prevista) {
    const inicio = new Date(payload.data_inicio);
    const fim = new Date(payload.data_fim_prevista);
    
    if (fim <= inicio) {
      throw new Error("Data de fim deve ser posterior à data de início");
    }
  }

  const res = await api.patch(`/projects/${id}`, payload);
  return res.data; // { data: project }
}

/**
 * UC02 - Deletar projeto
 * @param {number} id 
 * @returns {Promise}
 */
export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.status === 204 ? { success: true } : res.data;
}

/**
 * UC02 - Marcar interesse em projeto (freelancer)
 * @param {number} projectId 
 * @param {number} freelancerId 
 * @returns {Promise}
 */
export async function expressInterest(projectId, freelancerId) {
  const res = await api.post(`/projects/${projectId}/interest`, { freelancerId });
  return res.data; // { data: project }
}

/**
 * UC02 - Cancelar interesse
 * @param {number} projectId 
 * @param {number} freelancerId 
 * @returns {Promise}
 */
export async function cancelInterest(projectId, freelancerId) {
  const res = await api.delete(`/projects/${projectId}/interest/${freelancerId}`);
  return res.data; // { data: project }
}

/**
 * UC02 - Verificar se tem freelancers disponíveis
 * @returns {Promise<boolean>}
 */
export async function hasAvailableFreelancers() {
  try {
    const res = await api.get("/freelancers");
    return res.data.data.length > 0;
  } catch (err) {
    return false;
  }
}

/**
 * UC02 - Cancelar projeto
 * @param {number} id 
 * @param {string} motivo 
 * @returns {Promise}
 */
export async function cancelProject(id, motivo) {
  return updateProject(id, { 
    status: "CANCELADO",
    observacoes: motivo 
  });
}