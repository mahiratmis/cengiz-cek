"use client";

import { useState } from "react";
import styles from "../DemoLanding.module.css";

export default function TestimonialForm() {
  const [form, setForm] = useState({
    type: "student", // student | parent
    fullName: "",
    grade: "",
    childName: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Ad Soyad zorunludur.";
    if (!form.message.trim() || form.message.length < 10)
      return "Yorum en az 10 karakter olmalıdır.";
    if (form.type === "student" && !form.grade)
      return "Sınıf bilgisi gereklidir.";
    if (form.type === "parent" && !form.childName.trim())
      return "Öğrenci adı gereklidir.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNote("");
    const err = validate();
    if (err) return setNote({ type: "error", message: err });

    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Bir hata oluştu.");

      setNote({
        type: "success",
        message: data.message || "Yorumunuz alındı. Admin onayından sonra yayınlanacaktır.",
      });

      setForm({
        type: "student",
        fullName: "",
        grade: "",
        childName: "",
        message: "",
      });
    } catch (e2) {
      setNote(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      {note.message ? (
        <div
          className={
            note.type === "success"
              ? styles.successNote
              : styles.errorNote
          }
        >
          {note.message}
        </div>
      ) : null}        
      <h3 className={styles.testFormTitle}>💬 Siz de görüşünüzü paylaşın</h3>
      <div className={styles.formGrid}>
        <div>
            <label className={styles.radioLabel}>
            <input
                type="radio"
                name="type"
                value="student"
                checked={form.type === "student"}
                onChange={handleChange}
            />
            <span>Öğrenciyim</span>
            </label>
            <label className={styles.radioLabel}>
            <input
                type="radio"
                name="type"
                value="parent"
                checked={form.type === "parent"}
                onChange={handleChange}
            />
            <span>Veliyim</span>
            </label>
        </div>
      </div>

      <div>
      <label className={styles.label} htmlFor="fullName"> Ad Soyad </label>
      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Ad Soyad"
        className={styles.input}
      />
      </div>
      {form.type === "student" && (<label className={styles.label} htmlFor="grade"> Sınıf </label>)}
      {form.type === "student" && (
        <select
          name="grade"
          value={form.grade}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Sınıf Seçiniz</option>
          <option value="9">9. Sınıf</option>
          <option value="10">10. Sınıf</option>
          <option value="11">11. Sınıf</option>
          <option value="12">12. Sınıf</option>
          <option value="mezun">Mezun</option>
        </select>
      )}

      {form.type === "parent" && (<label className={styles.label} htmlFor="childName"> Öğrencinin Adı </label>)}
      {form.type === "parent" && (
        <input
          name="childName"
          value={form.childName}
          onChange={handleChange}
          placeholder="Öğrencinin Adı"
          className={styles.input}
        />
      )}

      <label className={styles.label} htmlFor="message"> Görüşünüz </label>
      <textarea
        name="message"
        rows={4}
        value={form.message}
        onChange={handleChange}
        placeholder="Görüşünüz"
        className={styles.textarea}
      />

      <button className={styles.btnPrimary} disabled={loading}>
        {loading ? "Gönderiliyor..." : "Yorum Gönder"}
      </button>

      <div className={styles.formNote}>
        Yorumlar admin onayından sonra yayınlanır.
      </div>
    </form>
  );
}
