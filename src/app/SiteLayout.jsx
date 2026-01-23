"use client";

import { useState } from "react";
import { Suspense } from "react";

import styles from "./DemoLanding.module.css";

import TopBar from "./components/TopBar";
import NavBar2 from "./components/NavBar2";
import Contact from "./components/Contact";
import Social from "./components/Social";
import Modal from "./components/Modal";
import ExamApplicationForm from "./components/ExamApplicationForm";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";

export default function SiteLayout({ children }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.page}>
      <TopBar onOpenForm={() => setShowForm(true)} />
      <Suspense fallback={null}>
      <NavBar2 />
      </Suspense>

      <main>{children}</main>

      <Contact />
      <Social />

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title="Sınav Başvuru Formu">
          <ExamApplicationForm onClose={() => setShowForm(false)} />
        </Modal>
      )}

      <BackToTop />
      <Footer />
    </div>
  );
}
