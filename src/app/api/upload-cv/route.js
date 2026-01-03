import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Dosya bulunamadı." }, { status: 400 });
    }

    // Şimdilik sadece PDF
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Sadece PDF yükleyebilirsiniz." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = ".pdf";
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 200 });
  } catch (err) {
    console.error("POST /api/upload-cv error:", err);
    return NextResponse.json(
      { message: "Dosya yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
