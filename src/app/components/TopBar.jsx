"use client";

import styles from "../DemoLanding.module.css";
import Container from "./Container";

import Link from "next/link";

const LOGO_URL = "/logo.jpg";

const startYear = 2000;
const years = new Date().getFullYear() - startYear;

export default function TopBar({ onOpenForm }) {
  return (
    <div className={styles.topbar}>
      <Container>
        <div className={styles.topInner}>
          <a
            href="/"
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
              <div className={styles.annivBadge}>

                <span className={styles.annivStar} aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    className={styles.annivStarIcon}
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </span>
                <span>Eğitimde <b>{years}.</b> Yılımız</span>


              </div>              
            </div>
          </a>

          <div className={styles.topRight}>
            <a
              className={styles.topLink}
              href="https://cengizegitim.edesis.com/account/login"
              target="_blank"
              rel="noreferrer"
            >
              Edesis Giriş
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
