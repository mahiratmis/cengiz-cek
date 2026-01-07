"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ImageUploadField from "../../components/ImageUploadField";


export default function BasariDuzenlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear(),
    uni: "",
    dept: "",
    photoUrl: "",
    photoPublicId: "",
    detail: "",
    slug: "",
    isFeatured: true,
    priority: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Kayıt getir
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setSuccess("");

    fetch(`/api/success-stories/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Kayıt bulunamadı.");
        }
        return data;
      })
      .then((data) => {
        setForm({
          name: data.name ?? "",
          year: data.year ?? new Date().getFullYear(),
          uni: data.uni ?? "",
          dept: data.dept ?? "",
          photoUrl: data.photoUrl || "",
          photoPublicId: data.photoPublicId || "",
          detail: data.detail ?? "",
          slug: data.slug ?? "",
          isFeatured: data.isFeatured ?? true,
          priority: data.priority ?? 0,
        });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Kayıt yüklenirken hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, [id]);

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
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/success-stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Güncelleme başarısız.");

      setSuccess("Başarı kaydı güncellendi.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu başarı kaydını silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/success-stories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silme başarısız.");

      router.push("/panel-cek-9xA3f/basarilar");
    } catch (err) {
      console.error(err);
      setError(err.message || "Silme sırasında bir hata oluştu.");
    }
  };

  if (loading) {
    return <div className="admin-content">Yükleniyor...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Başarı Kaydını Düzenle</h1>
          <p className="admin-muted-text">
            Yerleşen öğrencinin üniversite, bölüm ve hikâye bilgilerini
            güncelleyebilirsiniz.
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

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

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
          label="Öğrenci / Başarı Fotoğrafı"
          name="photo"
          value={{ url: form.photoUrl, publicId: form.photoPublicId }}
          onChange={(img) =>
            setForm((prev) => ({
              ...prev,
              photoUrl: img.url,
              photoPublicId: img.publicId,
            }))
          }
          hint="Kartlarda gözükecek. JPG/PNG önerilir."
          type="success"
          kind="image"
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
          <p className="form-hint">
            İleride /basari/slug sayfası için kullanılabilir.
          </p>
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
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDelete}
            disabled={saving}
          >
            Sil
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
