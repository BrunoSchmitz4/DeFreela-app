// src/context/projectsContext.jsx
import { createContext, useContext } from "react";
import { useProjects } from "../hooks/useProjects";

// Em todo e qualquer componente que eu queira usar esse context, basta eu usar a seguinte const:
// const { projects, createProject, cancelProject } = useProjectsContext();

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const {
    projects,
    loading,
    createProject,
    updateProject,
    cancelProject,
    deleteProject,
  } = useProjects();

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        createProject,
        updateProject,
        cancelProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  return useContext(ProjectsContext);
}
