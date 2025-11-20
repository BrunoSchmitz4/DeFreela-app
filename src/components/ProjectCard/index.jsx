import Button from "../ui/Button";
import styles from "./ProjectCard.module.css";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className={styles.card}>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.description}</p>

      <div className={styles.info}>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Valor:</strong> R$ {project.value}</p>

        {project.tags?.length > 0 && (
          <ul className={styles.tags}>
            {project.tags.map((tag, index) => (
              <li key={index} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button variant="secondary" fullWidth>
        Ver detalhes
      </Button>
    </Link>
  );
}

export default ProjectCard;
