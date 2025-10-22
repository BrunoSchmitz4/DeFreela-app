import RouterLink from '../../components/RouterLink';
import styles from './NotFound.module.css';

// Aqui preciso fazer o seguinte:
// Caso o usuário estiver logado, o início será a home, caso contrário, login
function NotFound() {
    return (
        <div className={styles.notfoundContainer}>
            <h2 className={styles.notfoundTitle}>Ups! Essa página não existe...</h2>
            <RouterLink Route="/" Title="Voltar para o início" Type="btn"/>
        </div>
    )
}

export default NotFound;