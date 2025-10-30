import Button from "../ui/Button";
import styles from "./ProjectCard.module.css";
import { Link } from "react-router-dom";

function ProjectCard({ contract }) {
  return (
    <>
      <Link
        to={`/contracts/${contract.id}`}
        className={styles.projectCardComponent}
      >
        <h3 className={styles.projectCardTitle}>{contract.title}</h3>
        <p className={styles.projectCardDesc}>{contract.description}</p>
        <div className={styles.projectCardInfos}>
          <p className={styles.projectCardStatus}>Status: {contract.status}</p>
          <p className={styles.projectCardValue}>Valor: R$ {contract.value}</p>
          <h3 className={styles.projectCardSubtitle}>Tags do projeto:</h3>
          {contract.tags?.length > 0 && (
            <ul className={styles.projectCardTagList}>
              {contract.tags.map((tag, index) => (
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
