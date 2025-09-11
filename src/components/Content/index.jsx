import styles from './Content.module.css';

function Content( { children }) {
    return (
        <section className={styles.contentContainer}>
            { children }
        </section>
    )
}

export default Content;