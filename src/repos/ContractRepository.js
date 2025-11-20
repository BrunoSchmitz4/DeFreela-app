import { contractService } from "../services/contractService";

export const ContractRepository = {
  async markInterest(projectId, freelancerId) {
    const res = await contractService.markInterest(projectId, freelancerId);
    return {
      projectId,
      freelancerId,
      status: "interested",
      ...res
    };
  },

  async unmarkInterest(projectId, freelancerId) {
    const res = await contractService.unmarkInterest(projectId, freelancerId);
    return {
      projectId,
      freelancerId,
      status: "not_interested",
      ...res
    };
  },

  async cancelContract(projectId, freelancerId) {
    const res = await contractService.cancelContract(projectId, freelancerId);
    return {
      projectId,
      freelancerId,
      status: "cancelado",
      ...res
    };
  }
};