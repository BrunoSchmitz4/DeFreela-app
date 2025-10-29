import { useState } from "react";
import styles from "./Projects.module.css";
import ProjectList from "./ProjectList";
import ProjectFilter from "./ProjectFilter";
import CreateProjectModal from "./CreateProjectModal";

// Simula o papel do usuário: "freelancer" ou "contratante"
const mockUser = {
  name: "Bruno Ferreira",
  role: "freelancer", // troque para "contratante" para testar outro cenário
};

function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Site institucional com React",
      description: "Desenvolver um site moderno para empresa de tecnologia.",
      value: 2500,
      deadline: "15 dias",
      tags: ["React", "UI/UX", "Frontend"],
      status: "Aberto",
    },
    {
      id: 2,
      title: "API RESTful com Spring Boot",
      description: "Backend para aplicativo de gestão de tarefas.",
      value: 3500,
      deadline: "30 dias",
      tags: ["Java", "Spring Boot", "REST"],
      status: "Aberto",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (newProject) => {
    setProjects([...projects, { id: projects.length + 1, ...newProject }]);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.projectsContainer}>
      <header className={styles.header}>
        <h1>Projetos</h1>
        {mockUser.role === "contratante" && (
          <button
            className={styles.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            + Novo Projeto
          </button>
        )}
      </header>

      <ProjectFilter />

      <ProjectList projects={projects} />

      {isModalOpen && (
        <CreateProjectModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}

export default Projects;
