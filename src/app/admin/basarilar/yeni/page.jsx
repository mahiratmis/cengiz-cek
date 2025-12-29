"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ImageUploadField from "../../components/ImageUploadField";

export default function YeniBasariPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    uni: "",
    dept: "",
    photoUrl: "",
    detail: "",
    slug: "",
    isFeatured: true,
    priority: 0,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "year" || name === "priority"
          ? Number(value || 0)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {

        const branchIdStr =
        typeof window !== "undefined"
          ? window.localStorage.getItem("activeBranch")
          : null;
  
      if (!branchIdStr) {
        setMessage("Önce sol menüden bir şube seçmelisiniz.");
        setSaving(false);
        return;
      }
  
      const branchId = Number(branchIdStr);
  
      const payload = {
        ...form,   // name, year, uni, dept, photoUrl, detail, slug, isFeatured, priority
        branchId,  // ⭐️ buraya eklendi
      };

      const res = await fetch("/api/success-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kayıt başarısız.");

      setMessage("Başarı kaydı eklendi.");
      setTimeout(() => router.push("/admin/basarilar"), 800);
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
          <h1 className="admin-page-title">Yeni Başarı Kaydı</h1>
          <p className="admin-muted-text">
            Yerleşen bir öğrenciyi başarılar sayfasına ekleyin.
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
          <label className="form-label">Öğrenci (ad / baş harf)</label>
          <input
            name="name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
            placeholder="E.B., M.K. vb."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Yıl</label>
          <input
            type="number"
            name="year"
            className="form-input"
            value={form.year}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Üniversite</label>
          <input
            name="uni"
            className="form-input"
            value={form.uni}
            onChange={handleChange}
            placeholder="İTÜ, ODTÜ, Hacettepe..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bölüm</label>
          <input
            name="dept"
            className="form-input"
            value={form.dept}
            onChange={handleChange}
            placeholder="Bilgisayar Mühendisliği, Tıp..."
          />
        </div>

        <ImageUploadField
          label="Öğrenci Fotoğrafı"
          name="photoUrl"
          value={form.photoUrl}
          onChange={(url) =>
            setForm((prev) => ({
              ...prev,
              photoUrl: url,
            }))
          }
          hint="Dilerseniz öğrencinin fotoğrafını yükleyebilirsiniz."
        />

        <div className="form-group">
          <label className="form-label">Kısa Açıklama / Hikâye</label>
          <textarea
            name="detail"
            className="form-input"
            rows={3}
            value={form.detail}
            onChange={handleChange}
            placeholder="Derece, çalışma süreci, hedefi vs."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug (isteğe bağlı)</label>
          <input
            name="slug"
            className="form-input"
            value={form.slug}
            onChange={handleChange}
            placeholder="itu-bilgisayar-2025-eb"
          />
          <p className="form-hint">İleride /basari/slug sayfası için kullanılabilir.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Sıra (öncelik)</label>
          <input
            type="number"
            name="priority"
            className="form-input"
            value={form.priority}
            onChange={handleChange}
          />
        </div>

        <div className="form-group form-group-inline">
          <input
            id="isFeatured"
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
          />
          <label htmlFor="isFeatured" className="form-label-inline">
            Anasayfada göster
          </label>
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
