import { useEffect, useState } from "react";
import styles from "./Contracts.module.css";
import ProjectCard from "../../components/ProjectCard";
import ProjectsMock from "../../mocks/projects";

function Contract() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    // Depois chamaremos: api.get("/contracts")
    setContracts(ProjectsMock);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Contratos</h1>

      <section className={styles.projectCardList}>
        {contracts.map((contracts) => (
          <ProjectCard key={contracts.id} contract={contracts}/>
        ))}
      </section>
    </div>
  );
}

export default Contract;
