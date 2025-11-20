import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./DropdownButton.module.css";

function DropdownButton({ routes }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        Menu
      </button>

      <ul className={`${styles.menu} ${open ? styles.open : ""}`}>
        {routes.map((r, i) => (
          <li key={i}>
            <Link to={r.path} onClick={() => setOpen(false)}>
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DropdownButton;
