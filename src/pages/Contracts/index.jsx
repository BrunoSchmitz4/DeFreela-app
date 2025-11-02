import { useEffect, useState } from "react";
import styles from "./Contracts.module.css";
import ProjectCard from "../../components/ProjectCard";
import ProjectsMock from "../../mocks/projects";

function Contract() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Depois chamaremos: api.get("/contracts")
    setProjects(ProjectsMock);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Contratos</h1>

      <section className={styles.projectCardList}>
        {projects.map((projects) => (
          <ProjectCard key={projects.id} project={projects}/>
        ))}
      </section>
    </div>
  );
}

export default Contract;
