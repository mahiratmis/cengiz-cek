"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command, arg = null) => {
    document.execCommand(command, false, arg);
    onChange(editorRef.current.innerHTML);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      exec("insertImage", data.url); // editöre <img> olarak ekle
    }
  };

  const handleFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => uploadImage(e.target.files[0]);
    input.click();
  };

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button onClick={() => exec("bold")}>B</button>
        <button onClick={() => exec("italic")}>I</button>
        <button onClick={() => exec("underline")}>U</button>

        <span className="rte-separator" />
        <button onClick={handleFile}>📁 Resim Yükle</button> {/* ✔ YENİ */}
      </div>

      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        onInput={() => onChange(editorRef.current.innerHTML)}
        suppressContentEditableWarning
      />
    </div>
  );
}
