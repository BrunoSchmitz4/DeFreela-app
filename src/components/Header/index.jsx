import { useState } from "react";
import RouterLink from "../RouterLink";
import styles from "./Header.module.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <h1 className={styles.headerTitle}>DeFreela</h1>

        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <nav
          className={`${styles.headerNavPages} ${
            menuOpen ? styles.navOpen : ""
          }`}
        >
          <RouterLink Route={"/"} Title={"Home"} />
          <RouterLink Route={"/contracts"} Title={"Contratos"} />
          <RouterLink Route={"/projects"} Title={"Projetos"} />
          <RouterLink Route={"/profile"} Title={"Perfil"} />
        </nav>
      </div>
    </header>
  );
}

export default Header;
