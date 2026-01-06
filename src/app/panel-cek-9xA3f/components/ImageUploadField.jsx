"use client";

import { useRef, useState } from "react";

/**
 * Cloudinary uyumlu image upload alanı
 * - Upload: /api/upload (tek endpoint)
 * - onChange: { url, publicId }
 * - Manual URL: { url, publicId: "" }
 */
export default function ImageUploadField({
  label = "Görsel",
  name = "image",
  value,             // artık string değil: {url, publicId} ya da null
  onChange,
  hint,
  uploadEndpoint = "/api/upload",
  type = "staff",
  kind = "image",
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelectClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("kind", kind);

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Yükleme başarısız.");

      // ✅ Üst formdaki state'e url + publicId yaz
      onChange?.({ url: data.url, publicId: data.publicId });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualChange = (e) => {
    const url = e.target.value;
    onChange?.({ url, publicId: "" });
  };

  const urlValue = typeof value === "string" ? value : (value?.url || "");

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* URL ile manuel girme */}
      <input
        name={name}
        className="form-input"
        value={urlValue}
        onChange={handleManualChange}
        placeholder="/uploads/... veya https://..."
      />

      {/* Yükle butonu + gizli input */}
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleFileSelectClick}
          disabled={uploading}
        >
          {uploading ? "Yükleniyor..." : "Dosya Yükle"}
        </button>
        {hint && <span className="form-hint">{hint}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Hata mesajı */}
      {error && (
        <div className="alert-error" style={{ marginTop: 8 }}>
          {error}
        </div>
      )}

      {/* Preview */}
      {urlValue ? (
        <div style={{ marginTop: 8 }}>
          <div className="form-hint">Önizleme</div>
          <img
            src={urlValue}
            alt="Önizleme"
            style={{
              maxWidth: "240px",
              maxHeight: "160px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
