import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import Button from "../../components/Button";
import Input from "../../components/Input";
import styles from "./Projects.module.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Aqui depois chamaremos a API do backend (Spring Boot)
    // Exemplo: api.get("/projects")
    const mockProjects = [
      { id: 1, title: "Landing Page para Startup", status: "open", price: 500 },
      { id: 2, title: "App de Delivery em React Native", status: "in_progress", price: 1500 },
      { id: 3, title: "API REST em Java Spring Boot", status: "closed", price: 1200 },
    ];
    setProjects(mockProjects);
  }, []);

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
          <Button variant="primary">Novo Projeto</Button>
        </div>
      </header>

      <section className={styles.list}>
        {filteredProjects.length ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>Nenhum projeto encontrado.</p>
        )}
      </section>
    </div>
  );
}

export default Projects;
