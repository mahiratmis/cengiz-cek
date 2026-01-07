"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const getHTML = () => editorRef.current?.innerHTML ?? "";

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command, arg = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    onChange(getHTML());
  };

  const uploadImage = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!editorRef.current) return;

    if (data.url) exec("insertImage", data.url);
  };

  const handleFile = () => {
    // (opsiyonel ama iyi) editor odak kalsın
    editorRef.current?.focus();

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => uploadImage(e.target.files?.[0]);
    input.click();
  };

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button type="button" onClick={() => exec("bold")}>B</button>
        <button type="button" onClick={() => exec("italic")}>I</button>
        <button type="button" onClick={() => exec("underline")}>U</button>

        <span className="rte-separator" />
        <button type="button" onClick={handleFile}>📁 Resim Yükle</button>
      </div>

      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        onInput={() => onChange(getHTML())}
        suppressContentEditableWarning
      />
    </div>
  );
}
