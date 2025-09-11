import styles from './Layout.module.css';

function Layout( { children }) {
    return (
        <section className={styles.contentContainer}>
            { children }
        </section>
    )
}

export default Layout;