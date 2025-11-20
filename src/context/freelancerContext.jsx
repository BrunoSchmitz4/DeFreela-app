import { createContext, useContext, useEffect, useState } from "react";
import { FreelancerRepository } from "../repos/FreelancerRepository";

const FreelancersContext = createContext();

export function FreelancersProvider({ children }) {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function response(data = null, error = null) {
    return { data, error, loading: false };
  }

  // ✔ Carrega todos os freelancers uma vez
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await FreelancerRepository.search("");
        setFreelancers(list);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);


  // UC06 — Buscar freelancers
  async function searchFreelancers(query = "", skillFilter = "") {
    try {
      setLoading(true);
      setError(null);

      const q = query.toLowerCase();
      let results = await FreelancerRepository.search(q);

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

      const data = await FreelancerRepository.getById(id);
      return response(data, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // Histórico (já que Mirage tem endpoint /freelancers/:id/jobs)
  async function getFreelancerWorkHistory(id) {
    try {
      setLoading(true);
      setError(null);

      const list = await FreelancerRepository.getJobs(id);
      return response(list, null);
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
      }}
    >
      {children}
    </FreelancersContext.Provider>
  );
}

export function useFreelancersContext() {
  return useContext(FreelancersContext);
}