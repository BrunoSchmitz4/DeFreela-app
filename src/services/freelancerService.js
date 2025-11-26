import api from "./api";

/**
 * ========================================
 * FREELANCER SERVICE - Alinhado com Spring Boot
 * ========================================
 * Controller: /api/freelancer
 * Entity: Freelancer com relacionamento OneToOne com Pessoa
 */

/**
 * Lista todos os freelancers
 * GET /api/freelancer/freelancers
 * 
 * Retorno esperado:
 * [
 *   {
 *     id: 2,
 *     pessoa: { id: 2, email: "...", tipo: "FREELANCER", ... },
 *     nomeCompleto: "João Silva",
 *     cpfCnpj: "12345678901",
 *     isPj: false,
 *     habilidades: "React, Node.js, CSS",
 *     valorHora: 80.00,
 *     portfolioUrl: "https://portfolio-joao.com"
 *   }
 * ]
 * 
 * @returns {Promise<Array>}
 */
export async function getFreelancers() {
  const res = await api.get("/freelancer/freelancers");
  return res.data;
}

/**
 * Cria um novo freelancer
 * POST /api/freelancer/freelancer
 * 
 * Payload esperado:
 * {
 *   pessoa: {
 *     email: "freelancer@example.com",
 *     senha: "senha123",
 *     tipo: "FREELANCER"
 *   },
 *   nomeCompleto: "João Silva",
 *   cpfCnpj: "12345678901",
 *   isPj: false,
 *   habilidades: "React, Node.js, CSS",
 *   valorHora: 80.00,
 *   portfolioUrl: "https://portfolio.com"
 * }
 * 
 * @param {Object} freelancer - Objeto Freelancer com Pessoa aninhada
 * @returns {Promise<Object>}
 */
export async function criarFreelancer(freelancer) {
  const res = await api.post("/freelancer/freelancer", freelancer);
  return res.data;
}

/**
 * Busca freelancer por ID
 * ⚠️ TODO: Endpoint ainda não existe no back-end
 * 
 * Quando implementado, será algo como:
 * GET /api/freelancer/{id}
 * 
 * @param {number} id 
 * @returns {Promise<Object>}
 */
export async function getFreelancerById(id) {
  // Este endpoint ainda não foi fornecido
  // Quando existir, será algo como: GET /api/freelancer/{id}
  throw new Error("Endpoint GET /api/freelancer/{id} ainda não implementado no back-end");
}

/**
 * Busca trabalhos do freelancer
 * ⚠️ TODO: Endpoint ainda não existe no back-end
 * 
 * Quando implementado, será algo como:
 * GET /api/freelancer/{id}/trabalhos
 * 
 * @param {number} id 
 * @returns {Promise<Array>}
 */
export async function getFreelancerJobs(id) {
  // Este endpoint ainda não foi fornecido
  throw new Error("Endpoint para buscar jobs do freelancer ainda não implementado no back-end");
}