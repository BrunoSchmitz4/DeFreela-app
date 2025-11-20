import styles from "./Modal.module.css";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={() => {
            return onClose;
          }} className={styles.closeBtn}>×</button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
