import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

async function destroyWithType(publicId, resource_type) {
  const r = await cloudinary.uploader.destroy(publicId, { resource_type });
  return r?.result; // "ok" | "not found" | ...
}

async function safeDestroy(publicId, kind) {
  if (!publicId) return;

  try {
    if (kind === "cv") {
      // ✅ önce raw dene
      let result = await destroyWithType(publicId, "raw");
      if (result === "ok") return;

      // ✅ olmadıysa image dene (PDF bazen image gibi tutuluyor)
      result = await destroyWithType(publicId, "image");
      if (result === "ok") return;

      console.error("CV destroy failed:", publicId, "result(raw/image)=", result);
      return;
    }

    const resource_type = kind === "video" ? "video" : "image";
    const result = await destroyWithType(publicId, resource_type);
    if (result !== "ok") {
      console.error("Destroy failed:", publicId, kind, "result=", result);
    }
  } catch (e) {
    console.error("Cloudinary destroy exception:", publicId, kind, e);
  }
}


export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
    }
    return NextResponse.json(staff);
  } catch (err) {
    console.error("GET /api/staff/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const prms = await params
  const id = Number(prms.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const body = await req.json();

    const {
      name,
      branch,
      role,
      photoUrl,
      photoPublicId, // ✅
      cvUrl,
      cvPublicId,    // ✅
      bio,
      priority,
      isActive,
      isFounder,
    } = body;

    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
    }
  

    // ✅ PublicId değiştiyse eskisini sil (manual URL girilmişse publicId boş gelebilir)
    const newPhotoPid = photoPublicId !== undefined ? (photoPublicId || null) : undefined;
    // ✅ CV: publicId değiştiyse veya url değiştiyse eskisini sil
    const cvUrlChanged = (cvUrl !== undefined) && ((cvUrl || null) !== (existing.cvUrl || null));
    const cvPidChanged =
      (cvPublicId !== undefined) &&
      (existing.cvPublicId) &&
      (existing.cvPublicId !== (cvPublicId || null));

    if (existing.cvPublicId && (cvPidChanged || cvUrlChanged)) {
      await safeDestroy(existing.cvPublicId, "cv");
    }


    if (
      newPhotoPid !== undefined &&
      existing.photoPublicId &&
      existing.photoPublicId !== newPhotoPid
    ) {
      await safeDestroy(existing.photoPublicId, "image");
    }


    const updated = await prisma.staff.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(branch !== undefined && { branch }),
        ...(role !== undefined && { role: role || null }),

        ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
        ...(photoPublicId !== undefined && { photoPublicId: photoPublicId || null }),

        ...(cvUrl !== undefined && { cvUrl: cvUrl || null }),
        ...(cvPublicId !== undefined && { cvPublicId: cvPublicId || null }),

        ...(bio !== undefined && { bio: bio || null }),
        ...(priority !== undefined && { priority }),
        ...(isActive !== undefined && { isActive }),
        ...(isFounder !== undefined && { isFounder }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/staff/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Kayıt bulunamadı." }, { status: 404 });
    }

    // ✅ önce cloudinary dosyalarını sil
    if (existing.photoPublicId) await safeDestroy(existing.photoPublicId, "image");
    if (existing.cvPublicId) await safeDestroy(existing.cvPublicId, "cv");

    // ✅ sonra DB’den sil
    await prisma.staff.delete({ where: { id } });

    return NextResponse.json({ message: "Kayıt silindi." });
  } catch (err) {
    console.error("DELETE /api/staff/[id] error:", err);
    return NextResponse.json(
      { message: "Kayıt silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
