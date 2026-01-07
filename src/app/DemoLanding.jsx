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
import Footer from "./components/Footer";
import LatestNews from "./components/LatestNews";
import SpecialPopupClient from "./components/SpecialPopupClient";

export default function DemoLanding({
  announcements = [],
  staff = [],
  successStories = [],
  contactBranch= null,
  testimonials = [],
  sliderItems = [],
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.page}>
      <SpecialPopupClient />
      <TopBar onOpenForm={() => setShowForm(true)} />
      <NavBar2 />
      <LatestNews announcements={announcements} />
      <Slider sliderItems={sliderItems}/>

      <main>
        <Hero onOpenForm={() => setShowForm(true)} />
        <StaffSection staff={staff}  mode="founders" />
        <StaffSection staff={staff}  mode="staff" />

        <Duyurular announcements={announcements} />
        <BasarilarSection successStories={successStories} />
        <VizyonMisyon />
        <Testimonials testimonials={testimonials}/>
        <Contact branch={contactBranch}/>
        <Social branch={contactBranch}/>
      </main>

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
