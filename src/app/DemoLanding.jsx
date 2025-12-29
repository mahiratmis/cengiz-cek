"use client";

import { useState } from "react";
import styles from "./DemoLanding.module.css";

import TopBar from "./components/TopBar";
import NavBar2 from "./components/NavBar2";
import Slider from "./components/Slider";
import Hero from "./components/Hero";
import Duyurular from "./Duyurular";
import StaffSection from "./StaffSection";
import BasarilarSection from "./BasarilarSection";
import VizyonMisyon from "./components/VizyonMisyon";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Social from "./components/Social";
import Modal from "./components/Modal";
import ExamApplicationForm from "./components/ExamApplicationForm";
import BackToTop from "./components/BackToTop";
import Container from "./components/Container";

export default function DemoLanding({
  announcements = [],
  staff = [],
  successStories = [],
  contactBranch= null,
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.page}>
      <TopBar onOpenForm={() => setShowForm(true)} />
      <NavBar2 />
      <Slider />

      <main>
        <Hero onOpenForm={() => setShowForm(true)} />
        <StaffSection staff={staff} />   {/* KADROMUZ */}
        <Duyurular announcements={announcements} />
        <BasarilarSection successStories={successStories} />
        <VizyonMisyon />
        <Testimonials />
        <Contact branch={contactBranch}/>
        <Social branch={contactBranch}/>
      </main>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <ExamApplicationForm onClose={() => setShowForm(false)} />
        </Modal>
      )}

      <BackToTop />
      <footer className={styles.footer}>
        <Container>
          © {new Date().getFullYear()} Cengiz Eğitim Kurumu
        </Container>
      </footer>
    </div>
  );
}
