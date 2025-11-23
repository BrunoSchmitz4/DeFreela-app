// src/context/projectContext.jsx - VERSÃO CORRIGIDA
import { createContext, useContext, useEffect, useState } from "react";
import { ProjectRepository } from "../repos/ProjectRepository";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  // 🔧 CORREÇÃO: Inicializar sempre como array vazio
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
        // 🔧 CORREÇÃO: Garantir que sempre é array
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
        setError(err);
        // 🔧 CORREÇÃO: Mesmo com erro, manter array vazio
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // UC03 — Meus projetos
  async function getMyProjects(userId) {
    const list = projects.filter((p) => p.empresa_id === userId);
    return response(list, null);
  }

  // UC08 — Buscar projetos
  async function searchProjects(query) {
    try {
      setLoading(true);
      const list = await ProjectRepository.getAll(query);
      // 🔧 CORREÇÃO: Garantir que sempre é array
      const safeList = Array.isArray(list) ? list : [];
      return response(safeList, null);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
      return response([], err);
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
      console.error("Erro ao criar projeto:", err);
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
      console.error("Erro ao atualizar projeto:", err);
      return response(null, err);
    }
  }

  // UC04 — Cancelar projeto
  async function cancelProject(id) {
    return updateProject(id, { status: "CANCELADO" });
  }

  // UC05 — Deletar projeto
  async function deleteProject(id) {
    try {
      await ProjectRepository.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return response(true, null);
    } catch (err) {
      console.error("Erro ao deletar projeto:", err);
      return response(null, err);
    }
  }

  // UC09 — Marcar interesse
  async function markInterest(projectId, freelancerId) {
    try {
      const updated = await ProjectRepository.expressInterest(
        projectId,
        freelancerId
      );
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
      return response(updated, null);
    } catch (err) {
      console.error("Erro ao marcar interesse:", err);
      return response(null, err);
    }
  }

  // UC10 — Retirar interesse
  async function removeInterest(projectId, freelancerId) {
    try {
      const updated = await ProjectRepository.cancelInterest(
        projectId,
        freelancerId
      );
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
      return response(updated, null);
    } catch (err) {
      console.error("Erro ao remover interesse:", err);
      return response(null, err);
    }
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects, // Sempre será array
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
  const context = useContext(ProjectsContext);
  
  // 🔧 CORREÇÃO: Verificar se contexto existe
  if (!context) {
    throw new Error('useProjectsContext must be used within ProjectsProvider');
  }
  
  return context;
}