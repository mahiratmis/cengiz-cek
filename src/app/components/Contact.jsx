import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Contact({ branch }) {
  const address =
    branch?.address ||
    "Mahfesığmaz Mah. 79085 Sk. No:1/A Çukurova / ADANA";

  const phone = branch?.phone || "0 (322) 000 00 00";

  const whatsappNumber = branch?.whatsapp || "90XXXXXXXXXX";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;

  const email = "info@cengizegitim.example"; // İstersen Branch'e email de ekleyebiliriz

  // 🔴 Harita URL'si: şubeye göre, yoksa default
  const mapSrc =
    branch?.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2156.1540423676156!2d35.3074714!3d37.046194199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2aa0b2a3c8a9783%3A0xf196104779892793!2zQ0VOR8SwWiBFxJ7EsFTEsE0!5e1!3m2!1str!2str!4v1766997090056!5m2!1str!2str";

  return (
    <section id="iletisim" className={styles.contact}>
      <Container>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          İletişim
        </h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <div className={styles.cRow}>
              <b>Adres:</b> {address}
            </div>
            <div className={styles.cRow}>
              <b>Telefon:</b> {phone}
            </div>
            <div className={styles.cRow}>
              <b>E-posta:</b> {email}
            </div>
            <div className={styles.cRow}>
              <b>Çalışma Saatleri:</b> Hafta içi 09:00–19:00, Cumartesi 10:00–17:00
            </div>
            <div className={styles.actions} style={{ marginTop: 16 }}>
              <a
                className={styles.btnPrimary}
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a className={styles.btnSecondary} href={`tel:${phone}`}>
                Ara
              </a>
            </div>
          </div>

          <div className={styles.mapWrap}>
            <iframe
              title="Cengiz Eğitim Konum"
              className={styles.mapBox}
              src={mapSrc}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

