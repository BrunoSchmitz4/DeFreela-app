import ProjectCard from "../../components/ProjectCard";
import styles from "./Profile.module.css";

function UserProjects({ projects }) {
  return (
    <section className={styles.userProjects}>
      <h3>Projetos Envolvidos</h3>
      {projects.length > 0 ? (
        <div className={styles.projectList}>
          {projects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>
      ) : (
        <p>Você ainda não está envolvido em nenhum projeto.</p>
      )}
    </section>
  );
}

export default UserProjects;
