import * as ProjectService from "../services/projectService";

export const ProjectRepository = {
  async getAll(search = "") {
    const res = await ProjectService.getAllProjects(search);
    return res.data; // array puro
  },

  async getById(id) {
    const res = await ProjectService.getProjectById(id);
    return res.data;
  },

  async create(payload) {
    const res = await ProjectService.createProject(payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await ProjectService.updateProject(id, payload);
    return res.data;
  },

  async delete(id) {
    return await ProjectService.deleteProject(id);
  },

  async expressInterest(projectId, freelancerId) {
    const res = await ProjectService.expressInterest(projectId, freelancerId);
    return res.data;
  },

  async cancelInterest(projectId, freelancerId) {
    const res = await ProjectService.cancelInterest(projectId, freelancerId);
    return res.data;
  }
};