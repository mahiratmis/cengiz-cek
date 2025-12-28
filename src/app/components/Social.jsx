import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Social() {
  return (
    <section className={styles.socialSection} id="sosyal">
      <Container>
        <div className={styles.socialTitle}>Bizi Takip Edin</div>
        <div className={styles.socialLinks}>
          <a
            className={styles.socialLink}
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            📷 Instagram
          </a>
          <a
            className={styles.socialLink}
            href="https://facebook.com/"
            target="_blank"
            rel="noreferrer"
          >
            📘 Facebook
          </a>
          <a
            className={styles.socialLink}
            href="https://x.com/"
            target="_blank"
            rel="noreferrer"
          >
            🐦 X (Twitter)
          </a>
          <a
            className={styles.socialLink}
            href="https://youtube.com/"
            target="_blank"
            rel="noreferrer"
          >
            ▶️ YouTube
          </a>
          <a
            className={styles.socialLink}
            href="https://wa.me/90XXXXXXXXXX"
            target="_blank"
            rel="noreferrer"
          >
            💬 WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}
