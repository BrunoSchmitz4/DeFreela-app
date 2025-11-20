import styles from "./FreelancerCard.module.css";
import Button from "../ui/Button";
import RouterLink from "../RouterLink";

export default function FreelancerCard({ freelancer, onAction, actionLabel }) {
  return (
    <div className={styles.card}>
      <img
        src={freelancer.avatar}
        alt={freelancer.name}
        className={styles.avatar}
      />

      <div className={styles.info}>
        <h3 className={styles.name}>{freelancer.name}</h3>
        <p className={styles.bio}>{freelancer.bio}</p>

        <div className={styles.skills}>
          {freelancer.skills.map((s, i) => (
            <span key={i} className={styles.skill}>{s}</span>
          ))}
        </div>
        <p className={styles.detail}><strong>Valor/hora:</strong> R$ {freelancer.hourlyRate}</p>
      </div>

      <div className={styles.actions}>
        <RouterLink Route={`/profile/${freelancer.id}`} Title={"Ver perfil"} />

        {onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
