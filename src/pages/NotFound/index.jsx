import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className={styles.notfoundContainer}>
            <h2 className={styles.notfoundTitle}>Ups! Essa página não existe...</h2>
            <button>Voltar à tela inicial</button>
        </div>
    )
}

export default NotFound;