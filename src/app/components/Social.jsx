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
  return `https://api.whatsapp.com/send?phone=${digits}`;
}

export default function Social({ branch }) {
  const instagramUrl =
    buildInstagramUrl(branch?.instagram) || "https://instagram.com/cengizegitimadana";
  const facebookUrl =
    buildFacebookUrl(branch?.facebook) || "https://facebook.com/61579583559207";
  const whatsappUrl =
    buildWhatsappUrl(branch?.whatsapp) || "https://api.whatsapp.com/send?phone=905054960496";

  return (
    <section className={styles.socialSection} id="sosyal">
      <Container>
        <div className={styles.socialTitle}>Bizi Takip Edin</div>

        <div className={styles.socialIcons}>
            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className={styles.ig}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm6.5-.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className={styles.fb}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9v-2.9h2.5V9.4c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9h2.9l-.5 2.9h-2.4v7A10 10 0 0022 12z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
              className={styles.wa}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 00-8.7 15l-1.3 5 5.1-1.3A10 10 0 1012 2zm4.6 13.5c-.2.5-1.2 1-1.7 1-.5 0-1.1.1-3.7-1.5-2.6-1.6-4.2-3.8-4.3-4.1-.1-.3-.7-1.8-.7-2.7 0-.9.5-1.3.7-1.5.2-.2.5-.2.7-.2h.5c.2 0 .4 0 .6.5.2.5.7 1.8.7 1.9.1.1.1.3 0 .4-.1.1-.2.3-.3.4-.1.1-.3.3-.4.4-.1.1-.2.3-.1.5.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1.2-.2.6-.7.7-.9.2-.2.3-.2.5-.1.2.1 1.4.6 1.6.7.2.1.4.2.4.3 0 .1 0 .6-.2 1.1z"/>
              </svg>
            </a>
          </div>
        </Container>
    </section>
  );
}


