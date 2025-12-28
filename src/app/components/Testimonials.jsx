import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Testimonials() {
  const items = [
    {
      q: "Deneme analizleri çok açıklayıcı, eksiklerimizi net görüyoruz.",
      a: "Veli",
    },
    {
      q: "Netlerim düzenli arttı, rehberlik desteği çok etkiliydi.",
      a: "Öğrenci",
    },
    {
      q: "Sınav simülasyonları ve çalışma ortamı mükemmel.",
      a: "Veli",
    },
  ];

  return (
    <section id="yorumlar" className={styles.testimonials}>
      <Container>
        <h2 className={styles.sectionTitle}>
          Öğrenci & Veli Yorumları
        </h2>
        <div className={styles.testGrid}>
          {items.map((t, i) => (
            <figure key={i} className={styles.testCard}>
              <div className={styles.testIcon}>“</div>
              <blockquote className={styles.testQuote}>
                {t.q}
              </blockquote>
              <figcaption className={styles.testAuthor}>
                — {t.a} Yorumu
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
