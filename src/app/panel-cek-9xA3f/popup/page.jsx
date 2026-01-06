"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "../components/ImageUploadField";

function toDTLocalValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  // datetime-local format: YYYY-MM-DDTHH:mm
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = dt.getFullYear();
  const mm = pad(dt.getMonth() + 1);
  const dd = pad(dt.getDate());
  const hh = pad(dt.getHours());
  const mi = pad(dt.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function AdminPopupPage() {
  const [popupId, setPopupId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: { url: "", publicId: "" },
    isActive: false,
    startAt: "",
    endAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/special-popups");
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Popup alınamadı.");

      if (!data) {
        // hiç popup yok
        setPopupId(null);
        setForm({
          title: "",
          description: "",
          image: { url: "", publicId: "" },
          isActive: false,
          startAt: "",
          endAt: "",
        });
      } else {
        setPopupId(data.id);
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          image: { url: data.imageUrl ?? "", publicId: data.imagePublicId ?? "" },
          isActive: data.isActive ?? false,
          startAt: toDTLocalValue(data.startAt),
          endAt: toDTLocalValue(data.endAt),
        });
      }
    } catch (e) {
      setError(e.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.image?.url) throw new Error("Lütfen bir görsel yükleyin.");

      const payload = {
        title: form.title,
        description: form.description,
        imageUrl: form.image.url,
        imagePublicId: form.image.publicId,
        isActive: form.isActive,
        startAt: form.startAt || null,
        endAt: form.endAt || null,
      };

      const url = popupId ? `/api/special-popups/${popupId}` : "/api/special-popups";
      const method = popupId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kaydetme başarısız.");

      setPopupId(data.id);
      setSuccess("Popup kaydedildi.");
    } catch (e2) {
      setError(e2.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!popupId) return;
    if (!confirm("Popup tamamen silinsin mi?")) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/special-popups/${popupId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silme başarısız.");

      setPopupId(null);
      setForm({
        title: "",
        description: "",
        image: { url: "", publicId: "" },
        isActive: false,
        startAt: "",
        endAt: "",
      });
      setSuccess("Popup silindi.");
    } catch (e) {
      setError(e.message || "Silme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-content">Yükleniyor...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Özel Gün Popup</h1>
          <p className="admin-muted-text">
            Aktif + tarih aralığı uygunsa ana sayfada otomatik popup çıkar.
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Başlık (opsiyonel)</label>
          <input
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="Örn: 29 Ekim Cumhuriyet Bayramı"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Açıklama (opsiyonel)</label>
          <textarea
            name="description"
            rows={3}
            className="form-input"
            value={form.description}
            onChange={handleChange}
            placeholder="Kısa açıklama..."
          />
        </div>

        <ImageUploadField
          label="Popup Görseli"
          name="image"
          value={form.image}
          onChange={(obj) => setForm((p) => ({ ...p, image: obj }))}
          hint="Öneri: dikey/poster ya da 4:3. Büyük boyutlar sorun değil."
          type="special_popup"
          kind="image"
        />

        <div className="form-group">
          <label className="form-label">Başlangıç (opsiyonel)</label>
          <input
            type="datetime-local"
            name="startAt"
            className="form-input"
            value={form.startAt}
            onChange={handleChange}
          />
          <div className="form-hint">Boşsa: hemen geçerli sayılır.</div>
        </div>

        <div className="form-group">
          <label className="form-label">Bitiş (opsiyonel)</label>
          <input
            type="datetime-local"
            name="endAt"
            className="form-input"
            value={form.endAt}
            onChange={handleChange}
          />
          <div className="form-hint">Boşsa: süresiz sayılır.</div>
        </div>

        <div className="form-group form-group-inline">
          <input
            id="isActive"
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive" className="form-label-inline">
            Aktif
          </label>
        </div>

        <div className="form-actions">
          {popupId ? (
            <button type="button" className="btn-secondary" onClick={handleDelete} disabled={saving}>
              Sil
            </button>
          ) : null}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : popupId ? "Güncelle" : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}
