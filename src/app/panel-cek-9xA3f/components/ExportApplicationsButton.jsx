"use client";

export default function ExportApplicationsButton({
  from = "",
  to = "",
  apiPath = "/api/exam-application/export",
  label = "Excel İndir",
  className = "btn-primary",
}) {
  const handleExport = () => {
    
    const qs = from ? `?from=${from}&to=${to}` : "";
    window.location.href = `${apiPath}${qs}`;
  };

  return (
    <button type="button" className={className} onClick={handleExport} style={{ marginLeft:"5px" }}>
      {label}
    </button>
  );
}
