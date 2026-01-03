"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor";
import ImageUploadField from "../../components/ImageUploadField";

export default function YeniDuyuruPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    audience: "genel",
    coverImage: "",
    isPublished: false,
    publishAt: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage("");

    try {

      // 🔴 Aktif şubeyi localStorage'dan alıyoruz
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
      ...form,
      branchId, // ⭐️ API'ye giden veride branchId var artık
      };

      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kayıt başarısız");

      setMessage("🎉 Duyuru başarıyla oluşturuldu!");
      setTimeout(() => router.push("/admin/duyurular"), 800);
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
          <h1 className="admin-page-title">Yeni Duyuru</h1>
          <p className="admin-muted-text">
            Site üzerinde yayınlanacak yeni bir duyuru oluşturun.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Geri
        </button>
      </div>

      {message && (
        <div className="alert-success">
          {message}
        </div>
      )}

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
            placeholder="Kartlarda görünecek 1–2 cümlelik özet (boş bırakılırsa içerikten kırpılır)."
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
          value={form.coverImage}
          onChange={(url) =>
            setForm((prev) => ({
              ...prev,
              coverImage: url,
            }))
          }
          hint="Dilerseniz dosya yükleyebilir veya direkt URL girebilirsiniz."
        />


        <div className="form-group">
          <label className="form-label">İçerik *</label>
          <div className="form-editor">
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
            />
          </div>
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
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
