// src/pages/Projects/SearchProjects/index.jsx - VERSÃO CORRIGIDA
import { useState, useEffect } from "react";
import { useProjectsContext } from "../../../context/projectContext";
import { useContracts } from "../../../hooks/useContracts";
import ProjectCard from "../../../components/ProjectCard";
import CardList from "../../../components/CardList";
import styles from "./SearchProjects.module.css";

export default function SearchProjects() {
  const { projects, loading } = useProjectsContext();
  const { interests, markInterest, unmarkInterest } = useContracts();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 🔧 CORREÇÃO: Adicionar verificação de loading e array vazio
  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando projetos...</p>
      </div>
    );
  }

  // 🔧 CORREÇÃO: Garantir que projects é sempre um array
  const projectsList = Array.isArray(projects) ? projects : [];

  // 🔧 CORREÇÃO: Filtros agora são seguros
  const filtered = projectsList.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      p.titulo?.toLowerCase().includes(q) ||
      p.descricao?.toLowerCase().includes(q);

    const matchesStatus = statusFilter ? p.status === statusFilter : true;

    return matchesQuery && matchesStatus;
  });

  const projectCards = filtered.map((p) => {
    const isInterested = interests.some((i) => i.id === p.id);

    return (
      <div key={p.id} className={styles.wrapperCardWithActions}>
        <ProjectCard project={p} />

        <div className={styles.cardActions}>
          <button
            style={{
              backgroundColor: isInterested ? "#ff5252" : "var(--light-blue)",
              color: "white",
            }}
            onClick={() =>
              isInterested
                ? unmarkInterest(p.id, 1)
                : markInterest(p.id, 1)
            }
          >
            {isInterested ? "Remover Interesse" : "Tenho Interesse"}
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Buscar Projetos</h1>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por nome ou tecnologia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="PLANEJAMENTO">Planejamento</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
      </header>

      {filtered.length === 0 ? (
        <p>Nenhum projeto encontrado.</p>
      ) : (
        <CardList renderItem={projectCards} />
      )}
    </div>
  );
}