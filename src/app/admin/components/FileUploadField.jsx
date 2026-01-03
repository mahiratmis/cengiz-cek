"use client";

import { useRef, useState } from "react";

/**
 * PDF/Doc vb. yüklemek için basit alan.
 * Varsayılan: sadece PDF.
 */
export default function FileUploadField({
  label = "Dosya",
  name = "file",
  value,
  onChange,
  hint,
  accept = "application/pdf",
  uploadEndpoint = "/api/upload-cv",
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

      const res = await fetch(uploadEndpoint, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Yükleme başarısız.");
      onChange?.(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualChange = (e) => onChange?.(e.target.value);

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
          value={value || ""}
          onChange={handleManualChange}
          placeholder="(Opsiyonel) Dosya URL"
          style={{ flex: 1 }}
        />
      </div>

      {value ? (
        <div style={{ marginTop: 6, fontSize: 13 }}>
          <a href={value} target="_blank" rel="noreferrer">
            Dosyayı Aç
          </a>
        </div>
      ) : null}

      {hint ? <div className="form-hint">{hint}</div> : null}
      {error ? <div className="alert-error">{error}</div> : null}
    </div>
  );
}
