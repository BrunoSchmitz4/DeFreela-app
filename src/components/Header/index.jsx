import RouterLink from '../RouterLink';
import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.headerContainer}>
            <h1 className={styles.headerTitle}>DeFreela</h1>
            <nav className={styles.headerNavPages}>
                <RouterLink Route={"/"} Title={"Home"}/>
                <RouterLink Route={"/contracts"} Title={"Contratos"}/>
                <RouterLink Route={"/Profile"} Title={"Projetos"}/>
                <RouterLink Route={"/projects"} Title={"Perfil"}/>
            </nav>
        </header>
    )
}

export default Header;