import { NextResponse } from "next/server";

const ADMIN_PATH = "/panel-cek-9xA3f";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Yeni admin yolu
  if (pathname === ADMIN_PATH || pathname.startsWith(ADMIN_PATH + "/")) {
    const ok = req.cookies.get("admin_session")?.value;

    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ✅ Eski /admin'i kapat
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel-cek-9xA3f",
    "/panel-cek-9xA3f/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
