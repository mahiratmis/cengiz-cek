import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Contact() {
  return (
    <section id="iletisim" className={styles.contact}>
      <Container>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          İletişim
        </h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.cRow}>
              <b>Adres:</b> Mahfesığmaz Mah. 79085 Sk. No:1/A Çukurova /
              ADANA
            </div>
            <div className={styles.cRow}>
              <b>Telefon:</b> 0 (322) 000 00 00
            </div>
            <div className={styles.cRow}>
              <b>E-posta:</b> info@cengizegitim.example
            </div>
            <div className={styles.cRow}>
              <b>Çalışma Saatleri:</b> Hafta içi 09:00–19:00, Cumartesi
              10:00–17:00
            </div>
            <div
              className={styles.actions}
              style={{ marginTop: 16 }}
            >
              <a
                className={styles.btnPrimary}
                href="https://wa.me/90XXXXXXXXXX"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a
                className={styles.btnSecondary}
                href="tel:+903220000000"
              >
                Ara
              </a>
            </div>
          </div>
          <div className={styles.mapWrap}>
            <iframe
              title="Cengiz Eğitim Konum"
              className={styles.mapBox}
              src="https://www.openstreetmap.org/export/embed.html?bbox=35.283%2C36.990%2C35.335%2C37.015&layer=mapnik"
              loading="lazy"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
