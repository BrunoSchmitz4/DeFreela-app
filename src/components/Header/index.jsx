import { useState } from "react";
import RouterLink from "../RouterLink";
import styles from "./Header.module.css";
import DropdownButton from "../DropdownButton";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const freelancersRoutes = [
    { label: 'Buscar Freelancers', path: '/freelancers/searchFreelancers' },
    { label: 'meus trabalhos', path: '/freelancers/myJobs' },
  ]

  const projectsRoutes = [
    { label: 'Buscar Projetos', path: '/projects/searchProjects' },
    { label: 'Meus Projetos', path: '/projects/myProjects' },
  ]

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
          <RouterLink Route={"/projects/searchProjects"} Title={"Buscar Projetos"} />
          <RouterLink Route={"/projects/myProjects"} Title={"Meus Projetos"} />
          <RouterLink Route={"/freelancers/searchFreelancers"} Title={"Buscar Freelancers"} />
          <RouterLink Route={"/freelancers/myJobs"} Title={"Meus Trabalhos"} />

          {/* <DropdownButton routes={freelancersRoutes}/>
          <DropdownButton routes={projectsRoutes}/> */}
          {/* <RouterLink Route={"/freelancers"} Title={"Freelancers"} />
          <RouterLink Route={"/projects"} Title={"Projetos"} /> */}
          <RouterLink Route={"/profile"} Title={"Perfil"} />
        </nav>
      </div>
    </header>
  );
}

export default Header;
