// src/pages/Projects/index.jsx
import { Outlet } from "react-router-dom";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <div className={styles.projectsContainer}>
      <h1>Projetos</h1>

      {/* <nav className={styles.navTabs}>
        <NavLink
          to="/projects/searchProjects"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          Buscar Projetos
        </NavLink>
        <NavLink
          to="/projects/myProjects"
          className={({ isActive }) =>
            isActive ? styles.activeTab : styles.tab
          }
        >
          Meus Projetos
        </NavLink>
      </nav> */}

      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
}
