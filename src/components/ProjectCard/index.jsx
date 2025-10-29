import styles from "./ProjectCard.module.css";
import { Link } from "react-router-dom";

function ProjectCard({ id, title, description, value, deadline, tags = [] }) {
  return (
    <Link to={`/contracts/${id}`} className={styles.cardLink}>
      <div className={styles.projectCardContainer}>
        <h2 className={styles.projectCardTitle}>{title}</h2>
        <div>
        <h3>Descrição</h3>
        <p className={styles.projectCardDescription}>{description}</p>
        </div>

        <div className={styles.projectCardInfo}>
            <span className={styles.projectCardValue}>Valor: R$ {value}</span>
            <span className={styles.projectCardDeadline}>Prazo: {deadline}</span>
        </div>
        <div>
        <h3>Tags do projeto:</h3>
            
            {tags.length > 0 && (
            <ul className={styles.projectCardTagList}>
                {tags.map((tag, index) => (
                <li key={index} className={styles.projectCardTagListItem}>
                    {tag}
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    </Link>
  );
}

export default ProjectCard;
