import * as FreelancerService from "../services/freelancerService";

export const FreelancerRepository = {
  /**
   * UC06 - Buscar freelancers
   */
  async search(query = "") {
    const res = await FreelancerService.getFreelancers(query);
    return res.data; // lista pura de freelancers
  },

  /**
   * UC07 - Buscar por ID
   */
  async getById(id) {
    const res = await FreelancerService.getFreelancerById(id);
    return res.data;
  },

  /**
   * UC07 - Buscar projetos do freelancer
   */
  async getJobs(id) {
    const res = await FreelancerService.getFreelancerJobs(id);
    return res.data; // lista pura de projetos
  },

  /**
   * UC01 - Criar novo freelancer
   */
  async create(payload) {
    const res = await FreelancerService.createFreelancer(payload);
    return res.data;
  },

  /**
   * UC01 - Atualizar freelancer
   */
  async update(id, payload) {
    const res = await FreelancerService.updateFreelancer(id, payload);
    return res.data;
  },

  /**
   * UC01 - Desativar freelancer
   */
  async deactivate(id) {
    const res = await FreelancerService.deactivateFreelancer(id);
    return res.data;
  },

  /**
   * UC01 - Verificar se tem projetos ativos
   */
  async hasActiveProjects(id) {
    return await FreelancerService.hasActiveProjects(id);
  }
};