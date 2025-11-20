import { useState } from "react";
import { ContractRepository } from "../repos/ContractRepository";

export function useContracts() {
  const [interests, setInterests] = useState([]);

  async function markInterest(projectId, freelancerId) {
    const result = await ContractRepository.markInterest(projectId, freelancerId);
    setInterests(prev => [...prev, result]);
  }

  async function unmarkInterest(projectId, freelancerId) {
    await ContractRepository.unmarkInterest(projectId, freelancerId);
    setInterests(prev =>
      prev.filter(
        i => !(i.projectId === projectId && i.freelancerId === freelancerId)
      )
    );
  }

  async function cancelContract(projectId, freelancerId) {
    const canceled = await ContractRepository.cancelContract(projectId, freelancerId);
    setInterests(prev =>
      prev.map(i =>
        i.projectId === projectId && i.freelancerId === freelancerId
          ? canceled
          : i
      )
    );
  }

  return { interests, markInterest, unmarkInterest, cancelContract };
}
