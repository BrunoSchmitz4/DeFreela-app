import { useEffect, useState } from "react";
import { ProjectRepository } from "../repos/ProjectRepository";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    const data = await ProjectRepository.getAll();
    setProjects(data);
    setLoading(false);
  }

  async function createProject(projectData) {
    const newProject = await ProjectRepository.create(projectData);
    setProjects(prev => [...prev, newProject]);
  }

  async function updateProject(id, updates) {
    const updated = await ProjectRepository.update(id, updates);
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
  }

  async function cancelProject(id) {
    const canceled = await ProjectRepository.update(id, { status: "cancelado" });
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...canceled } : p))
    );
  }

  async function deleteProject(id) {
    await ProjectRepository.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, createProject, updateProject, cancelProject, deleteProject };
}
