// src/pages/Projects/ProjectDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useProjectsContext } from "../../../context/projectContext";
import { useContracts } from "../../../hooks/useContracts";
import Button from "../../../components/ui/Button";
import styles from "./ProjectDetails.module.css";

function ProjectDetails() {
  const { id } = useParams();
  const { projects } = useProjectsContext();
  const { interests, markInterest, unmarkInterest } = useContracts();

  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className={styles.notFound}>
        <h2>Projeto não encontrado</h2>
        <Link to="/projects/searchProjects">
          <Button>Voltar para busca</Button>
        </Link>
      </div>
    );
  }

  const isInterested = interests.some((i) => i.projectId === project.id);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{project.title}</h1>
        <p>{project.description}</p>

        <div className={styles.tags}>
          <h3>Tags:</h3>
          {project.tags?.length > 0 ? (
            <ul className={styles.tagList}>
              {project.tags.map((tag, index) => (
                <li key={index} className={styles.tagItem}>
                  {tag}
                </li>
              ))}
            </ul>
          ) : (
            <p>Sem tags</p>
          )}
        </div>

        <div className={styles.infoBox}>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Valor:</strong> R$ {project.value ?? "—"}</p>
          <p><strong>Prazo:</strong> {project.deadline ?? "—"}</p>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" as={Link} to="/projects/searchProjects">
            Voltar
          </Button>

          <Button
            variant={isInterested ? "danger" : "primary"}
            onClick={() =>
              isInterested
                ? unmarkInterest(project.id, 1)
                : markInterest(project.id, 1)
            }
          >
            {isInterested ? "Remover Interesse" : "Tenho Interesse"}
          </Button>
        </div>
      </header>
    </div>
  );
}

export default ProjectDetails;