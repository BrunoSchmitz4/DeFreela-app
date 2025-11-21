import * as ProjectService from "../services/projectService";

export const ProjectRepository = {
  /**
   * UC02 - Listar todos os projetos
   */
  async getAll(search = "") {
    const res = await ProjectService.getAllProjects(search);
    return res.data; // array puro
  },

  /**
   * UC02 - Buscar projeto por ID
   */
  async getById(id) {
    const res = await ProjectService.getProjectById(id);
    return res.data;
  },

  /**
   * UC02 - Criar projeto (com validações)
   */
  async create(payload) {
    const res = await ProjectService.createProject(payload);
    return res.data;
  },

  /**
   * UC02 - Atualizar projeto
   */
  async update(id, payload) {
    const res = await ProjectService.updateProject(id, payload);
    return res.data;
  },

  /**
   * UC02 - Deletar projeto
   */
  async delete(id) {
    return await ProjectService.deleteProject(id);
  },

  /**
   * UC02 - Marcar interesse (freelancer)
   */
  async expressInterest(projectId, freelancerId) {
    const res = await ProjectService.expressInterest(projectId, freelancerId);
    return res.data;
  },

  /**
   * UC02 - Cancelar interesse
   */
  async cancelInterest(projectId, freelancerId) {
    const res = await ProjectService.cancelInterest(projectId, freelancerId);
    return res.data;
  },

  /**
   * UC02 - Verificar disponibilidade de freelancers
   */
  async hasAvailableFreelancers() {
    return await ProjectService.hasAvailableFreelancers();
  },

  /**
   * UC04 - Cancelar projeto
   */
  async cancel(id, motivo) {
    const res = await ProjectService.cancelProject(id, motivo);
    return res.data;
  }
};