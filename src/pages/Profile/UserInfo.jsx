import styles from "./Profile.module.css";

function UserInfo({ user }) {
  return (
    <section className={styles.userInfo}>
      <div className={styles.userPhotoContainer}>
        <img src={user.photo} alt={user.name} className={styles.userPhoto} />
      </div>
      <div className={styles.userDetails}>
        <h2 className={styles.userName}>{user.name}</h2>
        <p className={styles.userRole}>{user.role}</p>
        <p className={styles.userDescription}>{user.description}</p>
        <p className={styles.userEmail}>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </section>
  );
}

export default UserInfo;
