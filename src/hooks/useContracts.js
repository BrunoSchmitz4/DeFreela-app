// src/hooks/useContracts.js
import { useState } from "react";
import { contractService } from "../services/contractService";

export function useContracts() {
  const [interests, setInterests] = useState([]);

  async function markInterest(projectId, freelancerId) {
    const result = await contractService.markInterest(projectId, freelancerId);
    setInterests((prev) => [...prev, result]);
  }

  async function unmarkInterest(projectId, freelancerId) {
    await contractService.unmarkInterest(projectId, freelancerId);
    setInterests((prev) =>
      prev.filter(
        (i) => !(i.projectId === projectId && i.freelancerId === freelancerId)
      )
    );
  }

  async function cancelContract(projectId, freelancerId) {
    await contractService.cancelContract(projectId, freelancerId);
    setInterests((prev) =>
      prev.map((i) =>
        i.projectId === projectId && i.freelancerId === freelancerId
          ? { ...i, status: "cancelado" }
          : i
      )
    );
  }

  return { interests, markInterest, unmarkInterest, cancelContract };
}
