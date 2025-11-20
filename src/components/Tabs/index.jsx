import styles from "./Tabs.module.css";

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tabButton} ${
            activeTab === tab ? styles.active : ""
          }`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
