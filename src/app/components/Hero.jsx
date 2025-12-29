import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Hero({ onOpenForm }) {
  return (
    <section className={styles.hero}>
      <Container>
        <h1 className={styles.h1}>
          YKS’de başarıya{" "}
          <span className={styles.highlight}>akıllı denemeler</span> ile!
        </h1>
        <p className={styles.lead}>
          Öğrencilerimiz, düzenli TYT/AYT denemeleriyle gelişimlerini veri
          odaklı takip eder. Veli paneli, güçlü ve gelişmesi gereken alanları
          açıkça gösterir.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            type="button"
            onClick={onOpenForm}
          >
            Sınav Başvurusu
          </button>
          <a className={styles.btnSecondary} href="#duyurular">
            Duyurular
          </a>
        </div>
      </Container>
    </section>
  );
}
