"use client";

import { useRef, useState } from "react";

/**
 * PDF yüklemek için alan (Cloudinary uyumlu).
 * - Upload: /api/upload (tek endpoint)
 * - onChange: { url, publicId }
 * - Manual URL: { url, publicId: "" }
 */
export default function FileUploadField({
  label = "Dosya",
  name = "file",
  value,             // artık string değil: {url, publicId} ya da null
  onChange,
  hint,
  accept = "application/pdf",
  uploadEndpoint = "/api/upload", // ✅ tek endpoint
  type = "staff",                // ✅ klasör seçimi için
  kind = "cv",                   // ✅ cv için
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelectClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("kind", kind);

      const res = await fetch(uploadEndpoint, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || data?.message || "Yükleme başarısız.");

      // ✅ Cloudinary response: { url, publicId, ... }
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
    onChange?.({ url, publicId: "" }); // manual url => publicId yok
  };

  const urlValue = typeof value === "string" ? value : (value?.url || "");


  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleFileSelectClick}
          disabled={uploading}
        >
          {uploading ? "Yükleniyor..." : "Dosya Seç"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <input
          type="text"
          className="input"
          value={urlValue}
          onChange={handleManualChange}
          placeholder="(Opsiyonel) Dosya URL"
          style={{ flex: 1 }}
        />
      </div>

      {urlValue ? (
        <div style={{ marginTop: 6, fontSize: 13 }}>
          <a href={urlValue} target="_blank" rel="noreferrer">
            Dosyayı Aç
          </a>
        </div>
      ) : null}

      {hint ? <div className="form-hint">{hint}</div> : null}
      {error ? <div className="alert-error">{error}</div> : null}
    </div>
  );
}
