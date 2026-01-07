import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const adminSession = req.cookies.get("admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }

    const { publicId, kind } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "publicId yok" }, { status: 400 });
    }

    // ✅ Tipi biz biliyoruz
    const resourceType =
      kind === "video" ? "video" :
      kind === "cv" ? "raw" :
      "image";

    const r = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return NextResponse.json({ ok: true, result: r });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
