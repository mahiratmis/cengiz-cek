import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const FOLDERS = {
  staff_image: "cengiz-egitim/staff",
  staff_cv: "cengiz-egitim/staff-cv",
  staff_video: "cengiz-egitim/staff-video",
  announcement: "cengiz-egitim/announcement",
  success: "cengiz-egitim/success",
  slider: "cengiz-egitim/slider",
  special_popup: "cengiz-egitim/special_popup",
};

function uploadToCloudinary(buffer, opts) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(opts, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function POST(req) {
  try {
    // const adminSession = req.cookies.get("admin_session")?.value;
    // if (!adminSession) {
    //   return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    // }

    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "gallery";
    const kind = formData.get("kind") || "file";

    if (!file) {
      return NextResponse.json({ error: "Dosya yok" }, { status: 400 });
    }

    // Klasör seçimi
    let folder = FOLDERS[type] || FOLDERS.gallery;

    if (type === "staff" && kind === "image") folder = FOLDERS.staff_image;
    if (type === "staff" && (kind === "cv" || kind === "pdf")) folder = FOLDERS.staff_cv;
    if (type === "staff" && kind === "video") folder = FOLDERS.staff_video;

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;

    console.log(file);
    
    // Dosya uzantısını ve adını ayır
    const fileNameParts = originalName.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');

    // ✅ resource_type belirleme - PDF için mutlaka "raw" olmalı
    let resourceType = "image";
    if (kind === "video") {
      resourceType = "video";
    } else if (kind === "cv" || kind === "pdf" || extension.toLowerCase() === "pdf") {
      resourceType = "auto";
    }

    // ✅ public_id düzeltmesi - PDF için uzantı eklemeyelim
    let publicId = baseName;
    
    // Raw dosyalar için Cloudinary otomatik uzantı ekler
    // Manuel eklemek sorun çıkarabilir

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      public_id: publicId,
      use_filename: true,
      unique_filename: true,
    };

    // ✅ PDF için format belirtme (opsiyonel ama önerilir)
    if (resourceType === "raw" && extension.toLowerCase() === "pdf") {
      uploadOptions.format = "pdf";
    }

    const result = await uploadToCloudinary(buffer, uploadOptions);
    
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
    });
    
  } catch (e) {
    console.error("Upload hatası:", e);
    return NextResponse.json({ 
      error: "Upload başarısız", 
      details: e.message 
    }, { status: 500 });
  }
}