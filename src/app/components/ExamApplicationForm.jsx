import { useState } from "react";
import styles from "../DemoLanding.module.css";

export default function ExamApplicationForm({ onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    grade: "",
    phone: "",
    email: "",
    notes: "",
    kvkk: false,
  });
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Ad Soyad zorunludur.";
    if (!form.grade) return "Sınıf seviyesini seçiniz.";
    if (!/^[0-9\s()+-]{6,}$/.test(form.phone))
      return "Geçerli bir telefon giriniz.";
    if (!form.kvkk) return "KVKK onayı gereklidir.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNote({ type: "", message: "" });
    const err = validate();
    if (err) return setNote({ type: "error", message: err });
    setLoading(true);

    try {
      const res = await fetch("/api/exam-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Sunucudan beklenmeyen yanıt: ${res.status} ${text.slice(
            0,
            80
          )}...`
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Bir hata oluştu.");

      setNote({
        type: "success",
        message: data.message || "Başvurunuz alındı.",
      });
      setForm({
        fullName: "",
        grade: "",
        phone: "",
        email: "",
        notes: "",
        kvkk: false,
      });
    } catch (e2) {
      setNote({ type: "error", message: e2.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      fullName: "",
      grade: "",
      phone: "",
      email: "",
      notes: "",
      kvkk: false,
    });
    setNote({ type: "", message: "" });
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

      <div className={styles.formGrid} style={{align:"left"}}>
        <div>
          <label className={styles.label} htmlFor="fullName">
            Ad Soyad *
          </label>
          <input
            id="fullName"
            name="fullName"
            className={styles.input}
            value={form.fullName}
            onChange={handleChange}
            placeholder="Adınız Soyadınız"
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="grade">
            Sınıf *
          </label>
          <select
            id="grade"
            name="grade"
            className={styles.select}
            value={form.grade}
            onChange={handleChange}
          >
            <option value="">Seçiniz</option>
            <option value="7">7. Sınıf</option>
            <option value="8">8. Sınıf</option>
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="12">12. Sınıf</option>
            <option value="mezun">Mezun</option>
          </select>
          <div className={styles.helper}>
            YKS grubu için 11–12 veya Mezun seçebilirsiniz.
          </div>
        </div>
        <div>
          <label className={styles.label} htmlFor="phone">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            className={styles.input}
            value={form.phone}
            onChange={handleChange}
            placeholder="0 (5xx) xxx xx xx"
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="email">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            placeholder="ornek@eposta.com"
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="notes">
            Not
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className={styles.textarea}
            value={form.notes}
            onChange={handleChange}
            placeholder="Tercih edilen tarih / notlar"
          />
        </div>
        <div className={styles.kvkk}>
          <input
            id="kvkk"
            name="kvkk"
            type="checkbox"
            checked={form.kvkk}
            onChange={handleChange}
          />
          <label htmlFor="kvkk">
            KVKK aydınlatma metnini okudum ve kişisel verilerimin
            başvuru için işlenmesini onaylıyorum. *
          </label>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <button
          className={styles.submit}
          type="submit"
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
        </button>
        <button
          className={styles.reset}
          type="button"
          onClick={handleReset}
        >
          Temizle
        </button>
        {onClose && (<button
          className={styles.reset}
          type="button"
          onClick={onClose}
        >
          Kapat
        </button>
        )} 
      </div>
    </form>
  );
}
