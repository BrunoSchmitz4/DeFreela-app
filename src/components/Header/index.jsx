import { useState } from "react";
import { useAuth } from "../../context/authContext";
import RouterLink from "../RouterLink";
import Button from "../ui/Button";
import styles from "./Header.module.css";

function Header() {
  const { user, isAuthenticated, handleLogout } = useAuth();
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
          <RouterLink Route="/" Title="Home" />
          <RouterLink Route="/projects/searchProjects" Title="Buscar Projetos" />
          <RouterLink Route="/projects/myProjects" Title="Meus Projetos" />
          <RouterLink Route="/freelancers/searchFreelancers" Title="Buscar Freelancers" />
          <RouterLink Route="/freelancers/myJobs" Title="Meus Trabalhos" />
          <RouterLink Route="/profile" Title="Perfil" />

          {!isAuthenticated && (
            <RouterLink Route="/login" Title="Entrar" />
          )}

          {isAuthenticated && (
            <div className={styles.userSection}>
              <span className={styles.username}>
                Olá, {user?.name?.split(" ")[0]}!
              </span>

              <Button onClick={handleLogout} variant="secondary" fullWidth>
                Sair
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
