// app/api/exam-application/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, grade, phone, email, kvkk } = body || {};

    // Basit doğrulama (demo)
    if (!fullName || !grade || !phone || !kvkk) {
      return NextResponse.json(
        { ok: false, message: "Lütfen gerekli alanları doldurun." },
        { status: 400 }
      );
    }

    // (DEMO) Sunucu konsoluna yazalım
    console.log("[EXAM APPLICATION]", {
      fullName, grade, phone, email, at: new Date().toISOString(),
    });

    // 300ms yapay gecikme (isteğe bağlı)
    await new Promise((r) => setTimeout(r, 300));

    return NextResponse.json({ ok: true, message: "Başvurunuz alındı." });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
