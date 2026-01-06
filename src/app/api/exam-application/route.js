import { prisma } from "@/lib/prisma";

const phoneRegex = /^[0-9\s()+-]{6,}$/;

export async function POST(req) {
  try {
    const body = await req.json();

    const fullName = (body.fullName || "").trim();
    const grade = (body.grade || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();
    const notes = (body.notes || "").trim();
    const kvkk = Boolean(body.kvkk);

    // Backend doğrulama (frontend ile aynı mantık)
    if (!fullName) {
      return Response.json({ message: "Ad Soyad zorunludur." }, { status: 400 });
    }
    if (!grade) {
      return Response.json({ message: "Sınıf seviyesini seçiniz." }, { status: 400 });
    }
    if (!phoneRegex.test(phone)) {
      return Response.json({ message: "Geçerli bir telefon giriniz." }, { status: 400 });
    }
    if (!kvkk) {
      return Response.json({ message: "KVKK onayı gereklidir." }, { status: 400 });
    }

    await prisma.examApplication.create({
      data: {
        fullName,
        grade,
        phone,
        email: email || null,
        notes: notes || null,
        kvkk,
        kvkkAt: new Date(),
      },
    });

    return Response.json({ message: "Başvurunuz alındı." }, { status: 200 });
  } catch (e) {
    return Response.json({ message: "Başvuru kaydedilemedi." }, { status: 500 });
  }
}

export async function GET() {
  const items = await prisma.examApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return Response.json(items);
}
