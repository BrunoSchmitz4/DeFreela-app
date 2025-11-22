import api from "./api";

/**
 * UC06 - Listar/Buscar freelancers
 */
export async function getFreelancers(search = "") {
  const res = await api.get("/freelancers", {
    params: search ? { q: search } : {}
  });
  return res.data; // { data: [...] }
}

/**
 * UC07 - Buscar freelancer por ID
 */
export async function getFreelancerById(id) {
  const res = await api.get(`/freelancers/${id}`);
  return res.data;
}

/**
 * UC07 - Buscar projetos do freelancer
 */
export async function getFreelancerJobs(id) {
  const res = await api.get(`/freelancers/${id}/jobs`);
  return res.data;
}

/**
 * UC01 - Criar novo freelancer
 * @param {object} payload - { nome_completo, cpf_cnpj, is_pj, habilidades, valor_hora, portfolio_url, email }
 * @returns {Promise}
 */
export async function createFreelancer(payload) {
  const res = await api.post("/freelancers", payload);
  return res.data; // { data: freelancer }
}

/**
 * UC01 - Atualizar dados do freelancer
 * @param {number} id 
 * @param {object} payload 
 * @returns {Promise}
 */
export async function updateFreelancer(id, payload) {
  const res = await api.patch(`/freelancers/${id}`, payload);
  return res.data; // { data: freelancer }
}

/**
 * UC01 - Desativar freelancer (soft delete)
 * @param {number} id 
 * @returns {Promise}
 */
export async function deactivateFreelancer(id) {
  const res = await api.patch(`/freelancers/${id}`, { ativo: false });
  return res.data; // { data: freelancer }
}

/**
 * UC01 - Verificar se freelancer tem projetos ativos
 * @param {number} id 
 * @returns {Promise<boolean>}
 */
export async function hasActiveProjects(id) {
  try {
    const res = await api.get(`/freelancers/${id}/active-projects`);
    return res.data.data && res.data.data.length > 0;
  } catch (err) {
    // Se não houver endpoint, assume que não tem projetos ativos
    return false;
  }
}