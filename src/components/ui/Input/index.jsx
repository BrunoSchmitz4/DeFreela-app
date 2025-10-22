import styles from "./Input.module.css";

function Input({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  name,
  error 
}) {
  return (
    <div className={styles.container}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ""}`}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default Input;
