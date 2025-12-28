import styles from "../DemoLanding.module.css";

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>
            Sınav Başvuru Formu
          </h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Kapat"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
