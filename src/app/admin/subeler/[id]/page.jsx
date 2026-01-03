"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SubeDuzenlePage({ params }) {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    address: "",
    phone: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    mapEmbedUrl:"",    
    
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        setLoading(true);
        const res = await fetch(`/api/branches/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Şube bulunamadı.");

        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          instagram: data.instagram ?? "",
          facebook: data.facebook ?? "",
          whatsapp: data.whatsapp ?? "",
          mapEmbedUrl: data.mapEmbedUrl ?? "",          
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Güncelleme başarısız.");

      setMessage("✅ Şube bilgileri güncellendi.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silme başarısız.");

      router.push("/admin/subeler");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="admin-page">Şube yükleniyor...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Şube Düzenle</h1>
          <p className="admin-muted-text">
            Şube adını, adresini ve iletişim bilgilerini güncelleyebilirsiniz.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Geri
          </button>

        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {message && <div className="alert-success">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Şube Adı *</label>
          <input
            name="name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input
            name="slug"
            className="form-input"
            value={form.slug}
            onChange={handleChange}
          />
          <p className="form-hint">
            URL yönlendirme ve backend için benzersiz kısa ad (ör: mahfesigmaz).
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
          />
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp Numarası</label>
          <input
            name="whatsapp"
            className="form-input"
            value={form.whatsapp}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Instagram</label>
          <input
            name="instagram"
            className="form-input"
            value={form.instagram}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Facebook</label>
          <input
            name="facebook"
            className="form-input"
            value={form.facebook}
            onChange={handleChange}
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
            Bu şubenin konumunu gösterecek harita embed linki.
          </p>
        </div>


        <div className="form-actions">
        <button
            type="button"
            className="btn-secondary"
            style={{ borderColor: "#b91c1c", color: "#b91c1c" }}
            onClick={handleDelete}
          >
            Şubeyi Sil
          </button>            
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
