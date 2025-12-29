"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function YeniSubePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    address: "",
    phone: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    mapEmbedUrl: "",    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kayıt başarısız.");

      setMessage("🎉 Şube başarıyla oluşturuldu.");
      setTimeout(() => router.push("/admin/subeler"), 800);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Yeni Şube</h1>
          <p className="admin-muted-text">
            Yeni bir şube ekleyin. Bu şube, duyurular / kadro / başarılar ile ilişkilendirilebilir.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
        >
          Geri
        </button>
      </div>

      {message && <div className="alert-success">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Şube Adı *</label>
          <input
            name="name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
            placeholder="Mahfesığmaz, Kozan, Yüreğir..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input
            name="slug"
            className="form-input"
            value={form.slug}
            onChange={handleChange}
            placeholder="mahfesigmaz, kozan..."
          />
          <p className="form-hint">
            URL yönlendirme ve backend için benzersiz kısa ad (sube=mahfesigmaz gibi).
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Adres</label>
          <textarea
            name="address"
            className="form-input"
            rows={2}
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Telefon</label>
          <input
            name="phone"
            className="form-input"
            value={form.phone}
            onChange={handleChange}
            placeholder="0 (322) ..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp Numarası</label>
          <input
            name="whatsapp"
            className="form-input"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="905xx..."
          />
          <p className="form-hint">
            Sadece rakamlarla, başında 90 olacak şekilde girersen
            <code> https://wa.me/</code> ile birleştirilebilir.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Instagram</label>
          <input
            name="instagram"
            className="form-input"
            value={form.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Facebook</label>
          <input
            name="facebook"
            className="form-input"
            value={form.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Harita Embed URL</label>
          <input
            name="mapEmbedUrl"
            className="form-input"
            value={form.mapEmbedUrl}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?..."
          />
          <p className="form-hint">
            Google Maps veya OpenStreetMap embed linkini buraya yapıştırın.
          </p>
        </div>


        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
