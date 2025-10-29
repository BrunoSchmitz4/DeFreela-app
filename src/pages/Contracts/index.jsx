import React, { useEffect, useState } from "react";
import Button from '../../components/ui/Button';
import styles from "./Contracts.module.css";

function Contract() {
  const [contracts, setContracts] = useState([]);

//   useEffect(() => {
//   api.get("/projects").then(res => setProjects(res.data));
// }, []);

  useEffect(() => {
    // Depois chamaremos: api.get("/contracts")
    const mockContracts = [
      { id: 1, project: "Landing Page para Startup", status: "in_progress", freelancer: "João", price: 500 },
      { id: 2, project: "App de Delivery", status: "finished", freelancer: "Maria", price: 1500 },
    ];
    setContracts(mockContracts);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Contratos</h1>

      <section className={styles.list}>
        {contracts.map(contract => (
          <div key={contract.id} className={styles.card}>
            <h3>{contract.project}</h3>
            <p>Freelancer: {contract.freelancer}</p>
            <p>Status: {contract.status === "finished" ? "Finalizado" : "Em andamento"}</p>
            <p>Valor: R$ {contract.price}</p>
            <Button variant="secondary">Ver detalhes</Button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Contract;
