import styles from './ProjectCard.module.css'
import { Link } from 'react-router';

// Relacionado à um projeto, ao clicar, ele pegará o id do projeto e carregará as informações do projeto
function ProjectCard(projectCardTagList = [], projectCardTitle = "Título do projeto") {
    return (
        <>
            <Link to="/contracts/">
                <div className={styles.projectCardContainer}>
                    <h2 className={styles.projectCardTitle}>Título do projeto</h2>
                    {/* Lista de tags relacionadas ao projeto */}
                    <ul className={styles.projectCardTagList}>
                        <li className={styles.projectCardTagListItem}>React JS</li>
                        <li className={styles.projectCardTagListItem}>Next JS</li>
                        <li className={styles.projectCardTagListItem}>JSX</li>
                    </ul>
                </div>
            </Link>
        </>
    )
}

export default ProjectCard;