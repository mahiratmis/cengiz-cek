"use client";

import styles from "../DemoLanding.module.css";
import Container from "./Container";

const LOGO_URL = "/logo.jpg";

export default function TopBar({ onOpenForm }) {
  return (
    <div className={styles.topbar}>
      <Container>
        <div className={styles.topInner}>
          <a
            href="#"
            className={styles.topLeft}
            aria-label="Cengiz Eğitim Kurumu"
          >
            {LOGO_URL ? (
              <img
                src={LOGO_URL}
                alt="Cengiz Eğitim"
                className={styles.logoImg}
              />
            ) : (
              <div className={styles.logo}>CEK</div>
            )}
            <div>
              <div className={styles.title} style={{ fontSize: 18 }}>
                Cengiz Eğitim Kurumu
              </div>
              <div className={styles.tagline}>
                Şampiyonların Buluştuğu Adres
              </div>
            </div>
          </a>

          <div className={styles.topRight}>
            <a className={styles.topLink} href="/login/ogrenci">
              Öğrenci Girişi
            </a>
            <a className={styles.topLink} href="/login/veli">
              Veli Girişi
            </a>
            <button
              className={styles.btnPrimary}
              type="button"
              onClick={onOpenForm}
            >
              Sınav Başvurusu
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
