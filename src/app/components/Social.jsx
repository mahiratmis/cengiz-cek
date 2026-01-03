// src/app/components/Social.jsx
"use client";

import styles from "../DemoLanding.module.css";
import Container from "./Container";

function buildInstagramUrl(instagram) {
  if (!instagram) return null;
  const trimmed = instagram.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http")) return trimmed;
  if (trimmed.startsWith("@")) {
    return `https://instagram.com/${trimmed.slice(1)}`;
  }
  return `https://instagram.com/${trimmed}`;
}

function buildFacebookUrl(facebook) {
  if (!facebook) return null;
  const trimmed = facebook.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http")) return trimmed;
  return `https://facebook.com/${trimmed}`;
}

function buildWhatsappUrl(whatsapp) {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export default function Social({ branch }) {
  const instagramUrl =
    buildInstagramUrl(branch?.instagram) || "https://instagram.com/";
  const facebookUrl =
    buildFacebookUrl(branch?.facebook) || "https://facebook.com/";
  const whatsappUrl =
    buildWhatsappUrl(branch?.whatsapp) || "https://wa.me/90XXXXXXXXXX";

  return (
    <section className={styles.socialSection} id="sosyal">
      <Container>
        <div className={styles.socialTitle}>Bizi Takip Edin</div>
        <div className={styles.socialLinks}>
          <a
            className={styles.socialLink}
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            📷 Instagram
          </a>
          <a
            className={styles.socialLink}
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
          >
            📘 Facebook
          </a>
          <a
            className={styles.socialLink}
            href={whatsappUrl}
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
