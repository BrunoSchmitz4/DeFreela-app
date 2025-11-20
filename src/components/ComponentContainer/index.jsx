import styles from "./ComponentContainer.module.css";

function ComponentContainer({ children }) {
  return <section className={styles.container}>{children}</section>;
}

export default ComponentContainer;