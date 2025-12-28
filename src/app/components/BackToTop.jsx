import { useState, useEffect } from "react";
import styles from "../DemoLanding.module.css";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className={`${styles.backToTop} ${
        show ? styles.show : ""
      }`}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Yukarı çık"
      title="Yukarı çık"
    >
      ↑
    </button>
  );
}
