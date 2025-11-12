import { useEffect, useState } from "react";
import { projectService } from "../services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    const data = await projectService.getAll();
    setProjects(data);
    setLoading(false);
  }

  async function createProject(projectData) {
    const newProject = await projectService.create(projectData);
    setProjects((prev) => [...prev, newProject]);
  }

  async function updateProject(id, updates) {
    const updated = await projectService.update(id, updates);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  }

  async function cancelProject(id) {
    const canceled = await projectService.cancel(id);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...canceled } : p))
    );
  }

  async function deleteProject(id) {
    await projectService.remove(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, createProject, updateProject, cancelProject, deleteProject };
}
