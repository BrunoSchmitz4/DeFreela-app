import { useContracts } from "../../../hooks/useContracts";
import { useProjectsContext } from "../../../context/projectContext";
import CardList from "../../../components/CardList";
import ProjectCard from "../../../components/ProjectCard";
import styles from "./MyJobs.module.css";
import Button from "../../../components/ui/Button";

export default function MyJobs() {
  const { interests, unmarkInterest, cancelContract } = useContracts();
  const { createProject, loading, error } = useProjectsContext();

  // Busca os projetos que o freelancer marcou interesse
  const interestedProjects = interests.map((i) =>
    loading.find((p) => p.id === i.projectId)
  );

  // (Opcional futuro) Buscar contratos reais
  const activeContracts = []; // futuramente virá do backend

  const interestCards = interestedProjects.map((p) => (
    <div key={p.id} className={styles.wrapper}>
      <ProjectCard project={p} />
      <Button
        variant="danger"
        onClick={() => unmarkInterest(p.id, 1)}
      >
        Remover interesse
      </Button>
    </div>
  ));

  const contractCards = activeContracts.map((p) => (
    <div key={p.id} className={styles.wrapper}>
      <ProjectCard project={p} />
      <Button
        variant="danger"
        onClick={() => cancelContract(p.id, 1)}
      >
        Cancelar contrato
      </Button>
    </div>
  ));

  return (
    <div className={styles.container}>
      <h1>Meus Trabalhos</h1>

      <section className={styles.section}>
        <h2>Interesses</h2>
        {interestCards.length === 0 ? (
          <p>Nenhum interesse registrado.</p>
        ) : (
          <CardList renderItem={interestCards} />
        )}
      </section>

      <section className={styles.section}>
        <h2>Contratos</h2>
        {contractCards.length === 0 ? (
          <p>Nenhum contrato em andamento.</p>
        ) : (
          <CardList renderItem={contractCards} />
        )}
      </section>
    </div>
  );
}
