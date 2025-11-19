import { createContext, useContext, useState } from "react";

// MOCKS (substituir pelo back futuramente)
import freelancersMock from "../mocks/freelancers";

// Substituir quando tivermos a API
//import * as freelancerService from "../services/freelancerService";

const FreelancersContext = createContext();

export function FreelancersProvider({ children }) {
  const [freelancers, setFreelancers] = useState(freelancersMock);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function response(data = null, error = null) {
    return { data, error, loading: false };
  }

  // UC06 — Buscar freelancers
  async function searchFreelancers(query = "", skillFilter = "") {
    try {
      setLoading(true);
      setError(null);

      const q = query.toLowerCase();

      let results = freelancersMock.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.bio.toLowerCase().includes(q) ||
          f.skills.some((s) => s.toLowerCase().includes(q))
      );

      if (skillFilter) {
        results = results.filter((f) =>
          f.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase())
        );
      }

      return response(results, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC07 — Visualizar perfil de freelancer
  async function getFreelancerProfile(id) {
    try {
      setLoading(true);
      setError(null);

      const data = freelancersMock.find((f) => f.id === Number(id));

      // API real:
      // const { data } = await freelancerService.getFreelancer(id);

      if (!data) throw new Error("Freelancer não encontrado.");

      return response(data, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // Lista de freelancers que trabalharam em projetos
  // (funcionalidade interna ao perfil — opcional mas útil)
  async function getFreelancerWorkHistory(id) {
    try {
      setLoading(true);
      setError(null);

      const profile = freelancersMock.find((f) => f.id === Number(id));

      if (!profile) throw new Error("Freelancer não encontrado.");

      // MOCK: histórico dentro do próprio objeto (opcional)
      const data = profile.jobsHistory || [];

      return response(data, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // Atualizar freelancer (para edições futuras)
  async function updateFreelancer(id, updates) {
    try {
      setLoading(true);
      setError(null);

      const updated = freelancers.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      );

      setFreelancers(updated);

      const freelancerUpdated = updated.find((f) => f.id === id);

      return response(freelancerUpdated, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FreelancersContext.Provider
      value={{
        freelancers,
        loading,
        error,
        searchFreelancers,
        getFreelancerProfile,
        getFreelancerWorkHistory,
        updateFreelancer,
      }}
    >
      {children}
    </FreelancersContext.Provider>
  );
}

export function useFreelancersContext() {
  return useContext(FreelancersContext);
}