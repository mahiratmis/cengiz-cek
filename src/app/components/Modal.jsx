import styles from "../DemoLanding.module.css";

export default function Modal({ children, onClose, title }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 style={{ fontWeight: 700, fontSize: 18 }}>
            {title || "Modal"}
          </h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Kapat"
            type="button"
          >
            &times;
          </button>
        </div>

        {/* içerik alanı */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
