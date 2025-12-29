import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  const { filename } = params;

  try {
    const filePath = path.join(process.cwd(), "uploads", filename);
    const file = await readFile(filePath);

    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Image serve error:", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
