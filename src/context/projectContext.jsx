import { createContext, useContext, useEffect, useState } from "react";
import { ProjectRepository } from "../repos/ProjectRepository";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function response(data = null, error = null) {
    return { data, error, loading: false };
  }

  // ✔ Carrega todos os projetos ao iniciar
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await ProjectRepository.getAll();
        setProjects(list);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // UC03 — Meus projetos
  async function getMyProjects(userId) {
    const list = projects.filter((p) => p.ownerId === userId);
    return response(list, null);
  }

  // UC08 — Buscar projetos
  async function searchProjects(query) {
    try {
      setLoading(true);
      const list = await ProjectRepository.getAll(query);
      return response(list, null);
    } catch (err) {
      return response(null, err);
    } finally {
      setLoading(false);
    }
  }

  // UC01 — Criar projeto
  async function createProject(newProject) {
    try {
      const created = await ProjectRepository.create(newProject);
      setProjects((prev) => [...prev, created]);
      return response(created, null);
    } catch (err) {
      return response(null, err);
    }
  }

  // UC02 — Atualizar projeto
  async function updateProject(id, updates) {
    try {
      const updated = await ProjectRepository.update(id, updates);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      return response(updated, null);
    } catch (err) {
      return response(null, err);
    }
  }

  // UC04 — Cancelar projeto
  async function cancelProject(id) {
    return updateProject(id, { status: "cancelled" });
  }

  // UC05 — Deletar projeto
  async function deleteProject(id) {
    try {
      await ProjectRepository.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return response(true, null);
    } catch (err) {
      return response(null, err);
    }
  }

  // UC09 — Marcar interesse
  async function markInterest(projectId, freelancerId) {
    const updated = await ProjectRepository.expressInterest(
      projectId,
      freelancerId
    );
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? updated : p))
    );
    return response(updated, null);
  }

  // UC10 — Retirar interesse
  async function removeInterest(projectId, freelancerId) {
    const updated = await ProjectRepository.cancelInterest(
      projectId,
      freelancerId
    );
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? updated : p))
    );
    return response(updated, null);
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
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  return useContext(ProjectsContext);
}