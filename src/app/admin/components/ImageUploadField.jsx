"use client";

import { useRef, useState } from "react";

export default function ImageUploadField({
  label = "Görsel",
  name = "image",
  value,
  onChange,
  hint,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Yükleme başarısız.");

      // Üst formdaki state'e URL'yi yaz
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleManualChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* URL ile manuel girme */}
      <input
        name={name}
        className="form-input"
        value={value || ""}
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
      {error && <div className="alert-error" style={{ marginTop: 8 }}>{error}</div>}

      {/* Preview */}
      {value && (
        <div style={{ marginTop: 8 }}>
          <div className="form-hint">Önizleme</div>
          <img
            src={value}
            alt="Önizleme"
            style={{
              maxWidth: "240px",
              maxHeight: "160px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </div>
  );
}
