"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploadField from "../../components/ImageUploadField";
import FileUploadField from "../../components/FileUploadField";

export default function KadroDuzenlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    branch: "",
    role: "",
    photoUrl: "",
    photoPublicId: "",   // ✅
    cvUrl: "",
    cvPublicId: "",      // ✅
    bio: "",
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

    fetch(`/api/staff/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Kayıt bulunamadı.");
        return data;
      })
      .then((data) => {
        setForm({
          name: data.name ?? "",
          branch: data.branch ?? "",
          role: data.role ?? "",
          photoUrl: data.photoUrl ?? "",
          photoPublicId: data.photoPublicId ?? "", // ✅
          cvUrl: data.cvUrl ?? "",
          cvPublicId: data.cvPublicId ?? "",       // ✅
          bio: data.bio ?? "",
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
      const res = await fetch(`/api/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // ✅ publicId’ler de gider
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Güncelleme başarısız.");

      setSuccess("Kadro kaydı güncellendi.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu kadro kaydını silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Silme başarısız.");

      router.push("/panel-cek-9xA3f/kadro");
    } catch (err) {
      console.error(err);
      setError(err.message || "Silme sırasında bir hata oluştu.");
    }
  };

  if (loading) return <div className="admin-content">Yükleniyor...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kadro Kaydını Düzenle</h1>
          <p className="admin-muted-text">Öğretmen / personel bilgilerini güncelleyebilirsiniz.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Geri
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">İsim *</label>
          <input name="name" className="form-input" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Branş *</label>
          <input name="branch" className="form-input" value={form.branch} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Rol</label>
          <input name="role" className="form-input" value={form.role} onChange={handleChange} />
        </div>

        {/* ✅ FOTO */}
        <ImageUploadField
          label="Fotoğraf"
          value={{ url: form.photoUrl, publicId: form.photoPublicId }}
          onChange={(img) =>
            setForm((prev) => ({
              ...prev,
              photoUrl: img.url,
              photoPublicId: img.publicId,
            }))
          }
          type="staff"
          kind="image"
          hint="Fotoğraf yükleyebilir veya URL girebilirsiniz."
        />

        {/* ✅ CV */}
        <FileUploadField
          label="Özgeçmiş (PDF)"
          value={{ url: form.cvUrl, publicId: form.cvPublicId }}
          onChange={(f) =>
            setForm((prev) => ({
              ...prev,
              cvUrl: f.url,
              cvPublicId: f.publicId,
            }))
          }
          uploadEndpoint="/api/upload"
          type="staff"
          kind="cv"
          hint="PDF yükleyin; kadro detayında indirilebilir buton olarak çıkacak."
        />

        <div className="form-group">
          <label className="form-label">Kısa Tanıtım</label>
          <textarea name="bio" rows={3} className="form-input" value={form.bio} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Sıra (öncelik)</label>
          <input type="number" name="priority" className="form-input" value={form.priority} onChange={handleChange} />
        </div>

        <div className="form-group form-group-inline">
          <input id="isActive" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          <label htmlFor="isActive" className="form-label-inline">Aktif</label>
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
