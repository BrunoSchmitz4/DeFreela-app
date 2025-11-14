import styles from "./FreelancerCard.module.css";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function FreelancerCard({ freelancer, onAction, actionLabel }) {
  return (
    <div className={styles.card}>
      <img src={freelancer.avatar} alt={freelancer.name} className={styles.avatar} />

      <div className={styles.info}>
        <h3>{freelancer.name}</h3>
        <p className={styles.bio}>{freelancer.bio}</p>

        <div className={styles.skills}>
          {freelancer.skills.map((s, idx) => (
            <span key={idx} className={styles.skill}>
              {s}
            </span>
          ))}
        </div>

        <p><strong>Rating:</strong> ⭐ {freelancer.rating}</p>
        <p><strong>Valor por hora:</strong> R$ {freelancer.hourlyRate}</p>
      </div>

      <div className={styles.actions}>
        <Link to={`/freelancers/${freelancer.id}`}>
          <Button variant="secondary">Ver Perfil</Button>
        </Link>

        {onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
