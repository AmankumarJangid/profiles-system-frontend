import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`skeleton ${styles.avatar}`} />
      <div className={styles.body}>
        <div className={`skeleton ${styles.line}`} style={{ width: '65%', height: 20 }} />
        <div className={`skeleton ${styles.line}`} style={{ width: '45%', height: 14 }} />
        <div className={`skeleton ${styles.line}`} style={{ width: '80%', height: 13, marginTop: 4 }} />
        <div className={`skeleton ${styles.line}`} style={{ width: '60%', height: 13 }} />
        <div className={styles.chips}>
          <div className={`skeleton ${styles.chip}`} />
          <div className={`skeleton ${styles.chip}`} style={{ width: 64 }} />
          <div className={`skeleton ${styles.chip}`} style={{ width: 52 }} />
        </div>
      </div>
      <div className={`skeleton ${styles.footer}`} />
    </div>
  );
}
