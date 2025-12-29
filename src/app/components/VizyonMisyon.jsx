import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function VizyonMisyon() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.vmWrap}>
          <article className={styles.vmCard}>
            <h3 className={styles.vmTitle}>
              <span className={styles.vmBadge}>🎯</span>
              Vizyon
            </h3>
            <p className={styles.vmText}>
              Öğrencilerimizin potansiyelini veri temelli, bireysel
              yol haritalarıyla en üst düzeye çıkarmak.
            </p>
          </article>

          <article className={styles.vmCard}>
            <h3 className={styles.vmTitle}>
              <span className={styles.vmBadge}>📘</span>
              Misyon
            </h3>
            <p className={styles.vmText}>
              Ölçme-değerlendirme verilerini etkin kullanarak her
              öğrenciye uygun, şeffaf ve erişilebilir eğitim sunmak.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
