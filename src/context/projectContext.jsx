import { createContext, useContext, useState } from "react";

// IMPORTAÇÃO DOS MOCKS (simulação temporária)
import projectsMock from "../mocks/projects";

// Quando o back existir, só descomentar esse service:
// import * as projectService from "../services/projectService";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(projectsMock);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Utilitário padrão para padronizar retorno
  function response(data = null, error = null) {
    return { data, error, loading: false };
  }

  // UC03 — Listar projetos do usuário
  async function getMyProjects(userId) {
    try {
      setLoading(true);
      setError(null);

      // MOCK (temporário)
      const data = projectsMock.filter((p) => p.ownerId === userId);

      // API REAL (futuro)
      // const { data } = await projectService.getMyProjects(userId);

      return response(data, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC08 — Buscar projetos disponíveis para freelancers
  async function searchProjects(query = "") {
    try {
      setLoading(true);
      setError(null);

      const q = query.toLowerCase();

      const data = projectsMock.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );

      return response(data, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC01 — Criar projeto
  async function createProject(newProject) {
    try {
      setLoading(true);
      setError(null);

      const created = {
        ...newProject,
        id: Date.now(),
        status: "active",
      };

      setProjects((prev) => [...prev, created]);

      // API REAL
      // const { data } = await projectService.createProject(newProject);

      return response(created, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC02 — Atualizar projeto
  async function updateProject(id, updates) {
    try {
      setLoading(true);
      setError(null);

      const updated = projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );

      setProjects(updated);

      // API REAL:
      // const { data } = await projectService.updateProject(id, updates);

      const projectUpdated = updated.find((p) => p.id === id);

      return response(projectUpdated, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC04 — Cancelar projeto
  async function cancelProject(id) {
    try {
      setLoading(true);
      setError(null);

      const updated = projects.map((p) =>
        p.id === id ? { ...p, status: "cancelled" } : p
      );

      setProjects(updated);

      return response(updated.find((p) => p.id === id), null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC05 — Excluir projeto cancelado
  async function deleteProject(id) {
    try {
      setLoading(true);
      setError(null);

      const filtered = projects.filter((p) => p.id !== id);
      setProjects(filtered);

      return response(true, null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC09 — Marcar interesse em projeto
  async function markInterest(projectId, freelancerId) {
    try {
      setLoading(true);
      setError(null);

      const updated = projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              interested: [...(p.interested || []), freelancerId],
            }
          : p
      );

      setProjects(updated);

      return response(updated.find((p) => p.id === projectId), null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC10 — Retirar interesse
  async function removeInterest(projectId, freelancerId) {
    try {
      setLoading(true);
      setError(null);

      const updated = projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              interested: (p.interested || []).filter(
                (id) => id !== freelancerId
              ),
            }
          : p
      );

      setProjects(updated);

      return response(updated.find((p) => p.id === projectId), null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }
  
  // UC11 — Freelancer cancelar participação em um projeto
  async function freelancerCancelParticipation(projectId, freelancerId) {
    try {
      setLoading(true);
      setError(null);

      const updated = projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              assignedFreelancer:
                p.assignedFreelancer === freelancerId ? null : p.assignedFreelancer,
            }
          : p
      );

      setProjects(updated);

      return response(updated.find((p) => p.id === projectId), null);
    } catch (err) {
      setError(err);
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        error,
        getMyProjects,
        searchProjects,
        createProject,
        updateProject,
        cancelProject,
        deleteProject,
        markInterest,
        removeInterest,
        freelancerCancelParticipation,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  return useContext(ProjectsContext);
}
