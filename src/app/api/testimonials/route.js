import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const b = await req.json();

    const type = (b.type || "").trim(); // student | parent
    const fullName = (b.fullName || "").trim();
    const message = (b.message || "").trim();

    if (!["student", "parent"].includes(type)) {
      return Response.json({ message: "Geçersiz tür." }, { status: 400 });
    }
    if (!fullName) {
      return Response.json({ message: "Ad Soyad zorunludur." }, { status: 400 });
    }
    if (message.length < 10) {
      return Response.json({ message: "Yorum çok kısa." }, { status: 400 });
    }

    await prisma.testimonial.create({
      data: {
        type,
        fullName,
        grade: b.grade?.trim() || null,
        childName: b.childName?.trim() || null,
        phone: b.phone?.trim() || null,
        email: b.email?.trim() || null,
        message,
        approved: false,
      },
    });

    return Response.json({ message: "Yorumunuz alındı, onay sonrası yayınlanacaktır." });
  } catch {
    return Response.json({ message: "Kaydedilemedi." }, { status: 500 });
  }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending"; // pending | approved
  
    const approved = status === "approved";

    console.log("approved", approved)
  
    const items = await prisma.testimonial.findMany({
      where: { approved:approved },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  
    return Response.json(items);
  }
