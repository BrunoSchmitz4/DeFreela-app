import * as ProjetoFreelancerService from "../services/projetoFreelancerService"

export const ProjetoFreelancerRepository = {
  /**
   * UC01 - Atribuir freelancer ao projeto
   */
  async assign(projectId, freelancerId, papel, valorAcordado) {
    const payload = {
      freelancer_id: freelancerId,
      papel,
      valor_acordado: valorAcordado
    };

    const res = await ProjetoFreelancerService.assignFreelancerToProject(
      projectId, 
      payload
    );
    return res.data;
  },

  /**
   * UC01 - Listar freelancers do projeto (com dados completos)
   */
  async getByProject(projectId) {
    const res = await ProjetoFreelancerService.getProjectFreelancers(projectId);
    return res.data; // array puro de projeto_freelancer
  },

  /**
   * UC01 - Atualizar atribuição
   */
  async update(projectId, freelancerId, papel, valorAcordado) {
    const payload = {
      papel,
      valor_acordado: valorAcordado
    };

    const res = await ProjetoFreelancerService.updateFreelancerAssignment(
      projectId,
      freelancerId,
      payload
    );
    return res.data;
  },

  /**
   * UC01 - Remover freelancer
   */
  async remove(projectId, freelancerId) {
    return await ProjetoFreelancerService.removeFreelancerFromProject(
      projectId,
      freelancerId
    );
  },

  /**
   * UC01 - Verificar se já está atribuído
   */
  async isAssigned(projectId, freelancerId) {
    return await ProjetoFreelancerService.isFreelancerInProject(
      projectId,
      freelancerId
    );
  }
};