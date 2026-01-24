"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Slider({ sliderItems = [] }) {
  const fallback = [
    {
      imageUrl: "/gallery/1.jpg",
      title: "TYT Deneme Takvimi Güncellendi",
      updatedAt: "01 Eylül 2025",
      linkUrl: "/duyuru/tyt-takvim-guncelleme",
    },
    {
      imageUrl: "/gallery/2.jpg",
      title: "YKS Başarılarımız: 2025 Yerleşenler",
      updatedAt: "Duyuru",
      linkUrl: "/basarilar",
    }
  ];


  const slides = sliderItems.length ? sliderItems : fallback;



  const [i, setI] = useState(0);
  const intervalRef = useRef(null);

  const prev = () => setI((v) => (v === 0 ? slides.length - 1 : v - 1));
  const next = () => setI((v) => (v === slides.length - 1 ? 0 : v + 1));

  const startAuto = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setI((v) => (v === slides.length - 1 ? 0 : v + 1));
    }, 8000);
  };

  const stopAuto = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  return (
    <section className={styles.sliderSection} id="kareler">
      <Container>
        <div
          className={styles.sliderWrap}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(${-100 * i}%)`,
              transition: "transform .8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {slides.map((s, idx) => {
              const isExternal = s.linkUrl?.startsWith("http");
              return (
                <div key={idx} className={styles.slide}>
                  <a
                    className={styles.slideLink}
                    href={s.linkUrl}
                    {...(isExternal
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    aria-label={s.title}
                  >
                    <img
                      className={styles.slideImg}
                      src={s.imageUrl}
                      alt={s.title}
                      width={1600}
                      height={900}
                    />
                    <div className={styles.caption}>
                      <div className={styles.capTitle}>{s.title}</div>
                      {s.updatedAt ? (
                        <div className={styles.capMeta}>{new Date(s.updatedAt).toLocaleDateString("tr-TR")}</div>
                      ) : null}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          <button
            className={`${styles.sliderCtrl} ${styles.ctrlPrev}`}
            onClick={prev}
            aria-label="Önceki"
          >
            ‹
          </button>
          <button
            className={`${styles.sliderCtrl} ${styles.ctrlNext}`}
            onClick={next}
            aria-label="Sonraki"
          >
            ›
          </button>
        </div>

        <div className={styles.sliderDots}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${
                idx === i ? styles.dotActive : ""
              }`}
              aria-label={`Slayt ${idx + 1}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
