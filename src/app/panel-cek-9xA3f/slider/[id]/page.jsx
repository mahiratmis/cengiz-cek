"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUploadField from "../../components/ImageUploadField";

export default function SliderDuzenlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    linkUrl: "",
    image: { url: "", publicId: "" },
    priority: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setSuccess("");

    fetch(`/api/slider-items/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Kayıt bulunamadı.");
        return data;
      })
      .then((data) => {
        setForm({
          title: data.title ?? "",
          linkUrl: data.linkUrl ?? "",
          image: { url: data.imageUrl ?? "", publicId: data.imagePublicId ?? "" },
          priority: data.priority ?? 0,
          isActive: data.isActive ?? true,
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
          : name === "priority"
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
      if (!form.image?.url) {
        throw new Error("Slider görseli boş olamaz.");
      }

      const payload = {
        title: form.title,
        linkUrl: form.linkUrl,
        imageUrl: form.image.url,
        imagePublicId: form.image.publicId,
        priority: form.priority,
        isActive: form.isActive,
      };

      const res = await fetch(`/api/slider-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Güncelleme başarısız.");

      setSuccess("Slider kaydı güncellendi.");
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu slider kaydını silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/slider-items/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silme başarısız.");

      router.push("/panel-cek-9xA3f/slider");
    } catch (err) {
      setError(err.message || "Silme sırasında hata oluştu.");
    }
  };

  if (loading) return <div className="admin-content">Yükleniyor...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Slider Kaydını Düzenle</h1>
          <p className="admin-muted-text">Görseli, linki ve sıralamayı güncelleyin.</p>
        </div>

        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Geri
        </button>
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
          />
        </div>

        <div className="form-group">
          <label className="form-label">Link (opsiyonel)</label>
          <input
            name="linkUrl"
            className="form-input"
            value={form.linkUrl}
            onChange={handleChange}
          />
        </div>

        <ImageUploadField
          label="Slider Görseli"
          name="image"
          value={form.image}
          onChange={(obj) => setForm((p) => ({ ...p, image: obj }))}
          hint="Yeni görsel yüklerseniz eskisi Cloudinary'den silinir."
          type="slider"
          kind="image"
        />

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
          <button type="button" className="btn-secondary" onClick={handleDelete} disabled={saving}>
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
