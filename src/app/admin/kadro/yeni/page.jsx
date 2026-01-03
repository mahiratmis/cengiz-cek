"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ImageUploadField from "../../components/ImageUploadField";
import FileUploadField from "../../components/FileUploadField";

export default function YeniKadroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    branch: "",
    role: "",
    photoUrl: "",
    cvUrl: "",
    bio: "",
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
  
      const branchId = Number(branchIdStr);
  
      const payload = {
        ...form, // name, branch(ders), role vs
        branchId, // ⭐️ ekledik
      };

      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Kayıt başarısız.");

      setMessage("Kadro üyesi eklendi.");
      setTimeout(() => router.push("/admin/kadro"), 800);
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
          <h1 className="admin-page-title">Yeni Kadro Üyesi</h1>
          <p className="admin-muted-text">
            Öğretmen veya personel ekleyin.
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
          <label className="form-label">İsim *</label>
          <input
            name="name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Branş *</label>
          <input
            name="branch"
            className="form-input"
            value={form.branch}
            onChange={handleChange}
            placeholder="Matematik, Fizik, Rehberlik..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rol</label>
          <input
            name="role"
            className="form-input"
            value={form.role}
            onChange={handleChange}
            placeholder="Örn: Matematik Öğretmeni"
          />
        </div>

        <ImageUploadField
          label="Fotoğraf"
          name="photoUrl"
          value={form.photoUrl}
          onChange={(url) =>
            setForm((prev) => ({
              ...prev,
              photoUrl: url,
            }))
          }
          hint="Öğretmen fotoğrafını yükleyebilir veya URL girebilirsiniz."
        />
        
          <FileUploadField
            label="Özgeçmiş (PDF)"
            value={form.cvUrl}
            onChange={(url) => setForm((s) => ({ ...s, cvUrl: url }))}
            hint="PDF yükleyin; kadro detayında indirilebilir buton olarak çıkacak."
          />
<div className="form-group">
          <label className="form-label">Kısa Tanıtım</label>
          <textarea
            name="bio"
            rows={3}
            className="form-input"
            value={form.bio}
            onChange={handleChange}
            placeholder="Öğretmenin kısa özgeçmişi, yaklaşımı vs."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sıra (önce büyük gözüksün)</label>
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
