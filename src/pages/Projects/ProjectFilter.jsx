import styles from "./Projects.module.css";

function ProjectFilter() {
  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        placeholder="Buscar por nome ou tecnologia..."
        className={styles.filterInput}
      />
      <select className={styles.filterSelect}>
        <option value="">Todos os status</option>
        <option value="Aberto">Abertos</option>
        <option value="Em andamento">Em andamento</option>
        <option value="Concluído">Concluídos</option>
      </select>
    </div>
  );
}

export default ProjectFilter;
