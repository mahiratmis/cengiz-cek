"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor"; // yeni sayfadaki ile AYNI yolu kullan
import ImageUploadField from "../../components/ImageUploadField";


function toDatetimeLocalString(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  // "YYYY-MM-DDTHH:MM"
  return d.toISOString().slice(0, 16);
}

export default function DuyuruDuzenlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    audience: "genel",
    coverImageUrl: "",
    coverImagePublicId:"",
    isPublished: false,
    publishAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Duyuruyu API'den çek
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");
    setSuccess("");

    fetch(`/api/announcements/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || data?.error || "Duyuru bulunamadı.");
        }
        return data;
      })
      .then((data) => {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          summary: data.summary ?? "",
          content: data.content ?? "",
          audience: data.audience ?? "genel",
          coverImageUrl: data.coverImageUrl ?? "",
          coverImagePublicId: data.coverImagePublicId ?? "",
          isPublished: !!data.isPublished,
          publishAt: toDatetimeLocalString(data.publishAt),
        });
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Duyuru yüklenirken bir hata oluştu.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Güncelleme başarısız.");
      }

      setSuccess("Duyuru başarıyla güncellendi.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Silme başarısız.");
      }

      router.push("/panel-cek-9xA3f/duyurular");
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
          <h1 className="admin-page-title">Duyuruyu Düzenle</h1>
          <p className="admin-muted-text">
            Mevcut duyurunun başlık, özet, içerik ve yayın bilgilerini güncelleyebilirsiniz.
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
          <label className="form-label">Başlık</label>
          <input
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input
            name="slug"
            className="form-input"
            value={form.slug}
            onChange={handleChange}
            placeholder="ornek-duyuru-basligi"
          />
          <p className="form-hint">Bu alan /duyuru/slug şeklinde kullanılacak.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Kısa Özet</label>
          <textarea
            name="summary"
            className="form-input"
            rows={2}
            value={form.summary}
            onChange={handleChange}
            placeholder="Kartlarda görünecek 1–2 cümlelik özet (boşsa içerikten kırpılır)."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hedef Kitle</label>
          <select
            name="audience"
            className="form-input"
            value={form.audience}
            onChange={handleChange}
          >
            <option value="genel">Genel</option>
            <option value="veli">Veliler</option>
            <option value="ogrenci">Öğrenciler</option>
          </select>
        </div>

        <ImageUploadField
          label="Kapak Görseli"
          name="coverImage"
          value={{ url: form.coverImageUrl, publicId: form.coverImagePublicId }}          
          onChange={(img) =>
            setForm((prev) => ({
              ...prev,
              coverImageUrl: img.url,
              coverImagePublicId: img.publicId,
            }))
          }
          hint="Dosya yükleyebilir veya URL girebilirsiniz."
        />

        <div className="form-group">
          <label className="form-label">İçerik *</label>
          <RichTextEditor
            value={form.content}
            onChange={(html) =>
              setForm((prev) => ({
                ...prev,
                content: html,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Planlı Yayın Tarihi</label>
          <input
            type="datetime-local"
            name="publishAt"
            className="form-input"
            value={form.publishAt}
            onChange={handleChange}
          />
          <p className="form-hint">
            Boş bırakırsan kaydeder etmez görünür. Geleceğe tarih girersen o zamana kadar sitede görünmez.
          </p>
        </div>

        <div className="form-group form-group-inline">
          <input
            id="isPublished"
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />
          <label htmlFor="isPublished" className="form-label-inline">
            Yayında
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
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
