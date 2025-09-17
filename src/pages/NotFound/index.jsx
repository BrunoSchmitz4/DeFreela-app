import RouterLink from '../../components/RouterLink';
import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className={styles.notfoundContainer}>
            <h2 className={styles.notfoundTitle}>Ups! Essa página não existe...</h2>
            <RouterLink Route="/" Title="Voltar para o início" Type="btn"/>
        </div>
    )
}

export default NotFound;