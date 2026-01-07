"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../DemoLanding.module.css";

export default function AdminLoginClient() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const sp = useSearchParams();
  const router = useRouter();
  const next = sp.get("next") || "/panel-cek-9xA3f";

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (r.ok) {
      router.replace(next);
    } else {
      const j = await r.json().catch(() => ({}));
      setErr(j?.error || "Giriş başarısız");
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.container} style={{ maxWidth: 420 }}>
        <div className={styles.adminLoginWrap}>
          <h1 className={styles.sectionTitle}>Admin Girişi</h1>

          <form onSubmit={submit} className={styles.formCard}>
            <label className={styles.label}>Şifre</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin şifresi"
              autoFocus
            />

            {err ? <div className={styles.errorNote}>{err}</div> : null}

            <button className={styles.btnPrimary} disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>

            <div className={styles.helper} style={{ marginTop: 10 }}>
              Yetkisiz erişimler engellenir.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
