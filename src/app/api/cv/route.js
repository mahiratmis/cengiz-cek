import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isAllowedCloudinaryUrl(url) {
  try {
    const u = new URL(url);
    // kendi cloudinary cloud name’in
    if (u.hostname !== "res.cloudinary.com") return false;
    // dg2tv4gtr senin cloud name gibi duruyor (URL’ünden)
    if (!u.pathname.startsWith("/dg2tv4gtr/")) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const download = searchParams.get("download") === "1";

  if (!url) {
    return NextResponse.json({ message: "url parametresi gerekli" }, { status: 400 });
  }
  if (!isAllowedCloudinaryUrl(url)) {
    return NextResponse.json({ message: "İzin verilmeyen URL" }, { status: 400 });
  }

  // Cloudinary’den çek
  const origin =
  req.headers.get("origin") ||
  `https://${req.headers.get("host")}` || // lokal + prod
  "https://cengizegitim.com.tr";

const upstream = await fetch(url, {
  cache: "no-store",
  headers: {
    // ✅ Cloudinary hotlink/referrer koruması varsa bunu bekler
    Referer: origin,
    // bazı durumlarda UA da işe yarar
    "User-Agent": "Mozilla/5.0",
  },
});


  if (!upstream.ok) {
    return NextResponse.json(
      { message: "Dosya alınamadı", status: upstream.status },
      { status: 502 }
    );
  }

  const buf = Buffer.from(await upstream.arrayBuffer());

  // PDF’i tarayıcıya “PDF” diye tanıt + inline/attachment kontrolü
  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set(
    "Content-Disposition",
    `${download ? "attachment" : "inline"}; filename="cv.pdf"`
  );
  headers.set("Cache-Control", "public, max-age=3600");

  return new Response(buf, { status: 200, headers });
}
