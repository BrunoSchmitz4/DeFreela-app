import styles from "./Button.module.css";

function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  disabled = false,
  fullWidth = false 
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""}`}
    >
      {children}
    </button>
  );
}

export default Button;
