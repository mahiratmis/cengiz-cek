import { NextResponse } from "next/server";
import crypto from "crypto";

function timingSafeEqualStr(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const password = body?.password ?? "";

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
  const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

  if (!ADMIN_PASSWORD || !ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Server ayarı eksik (ADMIN_PASSWORD/ADMIN_SECRET)" },
      { status: 500 }
    );
  }

  const ok = timingSafeEqualStr(password, ADMIN_PASSWORD);

  if (!ok) {
    return NextResponse.json({ error: "Hatalı şifre" }, { status: 401 });
  }

  // Basit imzalı token (DB yok)
  const payload = `${Date.now()}`;
  const sig = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  const token = `${payload}.${sig}`;

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });

  return res;
}
