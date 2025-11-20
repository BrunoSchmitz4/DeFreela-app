import * as ProjectService from "./projectService";

export const contractService = {
  async markInterest(projectId, freelancerId) {
    const res = await ProjectService.expressInterest(projectId, freelancerId);
    return res; // { data: project }
  },

  async unmarkInterest(projectId, freelancerId) {
    const res = await ProjectService.cancelInterest(projectId, freelancerId);
    return res; // { data: project }
  },

  // se tiver endpoint de "cancelContract" específico no futuro, ajustar
  async cancelContract(projectId, freelancerId) {
    // por enquanto, marcamos status no projeto via patch (se quiser outro fluxo, podemos implementar)
    const payload = { status: "cancelado" };
    const res = await ProjectService.updateProject(projectId, payload);
    return res; // { data: project }
  },
};