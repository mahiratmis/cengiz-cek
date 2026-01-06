"use client";

import { useState } from "react";
import styles from "../DemoLanding.module.css";
import Container from "./Container";
import Modal from "./Modal";
import TestimonialForm from "./TestimonialForm";

export default function Testimonials({ testimonials = [] }) {
  const [open, setOpen] = useState(false);

  const fallback = [
    { message: "Deneme analizleri çok açıklayıcı, eksiklerimizi net görüyoruz.", a: "Veli" },
    { message: "Netlerim düzenli arttı, rehberlik desteği çok etkiliydi.", a: "Öğrenci" },
    { message: "Sınav simülasyonları ve çalışma ortamı mükemmel.", a: "Veli" },
  ];

  const items = testimonials.length ? testimonials : fallback;

  return (
    <section id="yorumlar" className={styles.testimonials}>
      <Container>
        <h2 className={styles.sectionTitle}>Öğrenci & Veli Yorumları</h2>

        <div className={styles.testGrid}>
          {items.map((t, i) => (
            <figure key={i} className={styles.testCard}>
              <div className={styles.testIcon}>“</div>
              <blockquote className={styles.testQuote}>{t.message}</blockquote>
              <figcaption className={styles.testAuthor}>— {t.type ==="student" ?" Öğrenci" : "Veli"} Yorumu</figcaption>
            </figure>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.testCta}>
          <div className={styles.testCtaText}>
            Siz de yorum bırakmak ister misiniz?
          </div>
          <button className={styles.btnPrimary} type="button" onClick={() => setOpen(true)}>
            Yorum Gönder
          </button>
        </div>

        {/* Modal */}
        {open ? (
          <Modal title="Yorum Gönder" onClose={() => setOpen(false)}>
            <TestimonialForm />
          </Modal>
        ) : null}          
      </Container>
    </section>
  );
}
