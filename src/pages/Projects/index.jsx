import { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import CreateProjectModal from "../../components/CreateProjectModal";
import styles from "./Projects.module.css";
import ProjectsMock from '../../mocks/projects';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { setProjects(ProjectsMock) }, []);

  const handleCreateProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filter === "all" || project.status === filter;
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Projetos</h1>
        <div className={styles.filters}>
          <Input
            placeholder="Buscar projeto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="open">Abertos</option>
            <option value="in_progress">Em andamento</option>
            <option value="closed">Finalizados</option>
          </select>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Novo Projeto
          </Button>
        </div>
      </header>

      <section className={styles.projectCardList}>
        {filteredProjects.length ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>Nenhum projeto encontrado.</p>
        )}
      </section>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}

export default Projects;
