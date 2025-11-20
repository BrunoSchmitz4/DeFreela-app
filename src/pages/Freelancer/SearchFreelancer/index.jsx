import { useState } from "react";
import { useFreelancersContext } from "../../../context/freelancerContext";
import FreelancerCard from "../../../components/FreelancerCard";
import CardList from "../../../components/CardList";
import styles from './SearchFreelancer.module.css'

export default function SearchFreelancers() {
  const { freelancers, loading, searchFreelancers } = useFreelancersContext();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchFreelancers(value);
  };

  const cards = freelancers.map((f) => (
    <FreelancerCard key={f.id} freelancer={f} />
  ));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Buscar Freelancers</h1>

        <input
          type="text"
          placeholder="Digite nome, skill ou tecnologia..."
          value={query}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </header>

      {loading ? (
        <p>Carregando...</p>
      ) : freelancers.length === 0 ? (
        <p>Nenhum freelancer encontrado.</p>
      ) : (
        <CardList items={cards} />
      )}
    </div>
  );
}
