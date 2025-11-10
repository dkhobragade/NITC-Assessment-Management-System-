import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

// Multer memory storage (files not stored on disk)
const storage = multer.memoryStorage();

const parser = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Upload buffer to Cloudinary
export const uploadToCloudinary = (fileBuffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pdf_uploads", resource_type: "raw", public_id: publicId },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export default parser;
