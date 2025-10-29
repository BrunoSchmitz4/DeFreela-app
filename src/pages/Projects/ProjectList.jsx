import ProjectCard from "../../components/ProjectCard";
import styles from "./Projects.module.css";

function ProjectList({ projects }) {
  return (
    <section className={styles.projectList}>
      {projects.map((p) => (
        <ProjectCard key={p.id} {...p} />
      ))}
    </section>
  );
}

export default ProjectList;
