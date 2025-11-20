import Button from "../ui/Button";
import styles from "./ProjectCard.module.css";
import { Link } from "react-router-dom";


/**
 * @Description Card para exibição de projects. Recebe como param
 * @returns 
 */
function ProjectCard({ project }) {
  return (
    <>
      <Link
        to={`/projects/${project.id}`}
        className={styles.projectCardComponent}
      >
        <h3 className={styles.projectCardTitle}>{project.title}</h3>
        <p className={styles.projectCardDesc}>{project.description}</p>
        <div className={styles.projectCardInfos}>
          <p className={styles.projectCardStatus}>Status: {project.status}</p>
          <p className={styles.projectCardValue}>Valor: R$ {project.value}</p>
          <h3 className={styles.projectCardSubtitle}>Tags do projeto:</h3>
          {project.tags?.length > 0 && (
            <ul className={styles.projectCardTagList}>
              {project.tags.map((tag, index) => (
                <li key={index} className={styles.projectCardTagListItem}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.projectCardButton}>
          <Button variant="secondary">Ver detalhes</Button>
        </div>
      </Link>
    </>
  );
}

export default ProjectCard;
