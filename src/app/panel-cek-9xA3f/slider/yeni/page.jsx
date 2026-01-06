"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "../../components/ImageUploadField";

export default function YeniSliderPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    linkUrl: "",
    image: { url: "", publicId: "" }, // ✅ ImageUploadField objesi
    priority: 0,
    isActive: true,
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
          : name === "priority"
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

      if (!form.image?.url) {
        setMessage("Lütfen bir slider görseli yükleyin.");
        setSaving(false);
        return;
      }

      const payload = {
        title: form.title,
        linkUrl: form.linkUrl,
        imageUrl: form.image.url,
        imagePublicId: form.image.publicId,
        priority: form.priority,
        isActive: form.isActive,
        branchId: Number(branchIdStr),
      };

      const res = await fetch("/api/slider-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kayıt başarısız.");

      setMessage("Slider görseli eklendi.");
      setTimeout(() => router.push("/panel-cek-9xA3f/slider"), 600);
    } catch (err) {
      setMessage(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Yeni Slider Görseli</h1>
          <p className="admin-muted-text">Seçili şube için yeni görsel ekleyin.</p>
        </div>

        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Geri
        </button>
      </div>

      {message && <div className="alert-success">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Başlık (opsiyonel)</label>
          <input
            name="title"
            className="form-input"
            value={form.title}
            onChange={handleChange}
            placeholder="Örn: TYT Kampı Başladı"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Link (opsiyonel)</label>
          <input
            name="linkUrl"
            className="form-input"
            value={form.linkUrl}
            onChange={handleChange}
            placeholder="/duyurular veya https://..."
          />
          <div className="form-hint">
            Boş bırakırsanız görsele tıklayınca bir yere gitmez.
          </div>
        </div>

        <ImageUploadField
          label="Slider Görseli"
          name="image"
          value={form.image}
          onChange={(obj) => setForm((p) => ({ ...p, image: obj }))}
          hint="Öneri: yatay (16:9) görsel."
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
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
