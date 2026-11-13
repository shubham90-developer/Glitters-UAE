import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getUploadFolder = (req: Request): string => {
  const url = req.originalUrl.toLowerCase();

  if (url.includes("/home-banner")) return "homeBanner";
  if (url.includes("/about-us")) return "aboutUs";
  if (url.includes("/founder-info")) return "founderInfo";
  if (url.includes("/lunching-products")) return "launchingProducts";
  if (url.includes("/drone-products")) return "droneProducts";
  if (url.includes("/digital-experience")) return "digitalExperience";
  if (url.includes("/we-offer")) return "weOffer";
  if (url.includes("/life")) return "life";
  if (url.includes("/drone-catlouge")) return "droneCatlouge";
  if (url.includes("/awards")) return "awards";
  if (url.includes("/certificates")) return "certificates";
  if (url.includes("/media-coverage")) return "media-coverage";
  if (url.includes("/services")) return "services";
  if (url.includes("/enquiries-careers")) return "enquiries-careers";
  if (url.includes("/testimonials")) return "testimonials";
  if (url.includes("/gallery")) return "gallery";
  if (url.includes("/products")) return "products";
  if (url.includes("/seo-pages")) return "seo-pages";

  return "uploads";
};

// =====================================================
// SANITIZE FILE NAME
// =====================================================

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};

// =====================================================
// GET EXTENSION
// =====================================================

const getFileExtension = (fileName: string): string => {
  const match = fileName.match(/\.([^/.]+)$/);

  return match ? match[1].toLowerCase() : "";
};

// =====================================================
// WORD DETECTION
// Some browsers/OS combinations send .doc/.docx files as
// application/octet-stream, so we also check the extension.
// =====================================================

const WORD_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const WORD_EXTENSIONS = ["doc", "docx"];

const isWordFile = (file: Express.Multer.File): boolean => {
  if (WORD_MIME_TYPES.includes(file.mimetype)) return true;

  return (
    file.mimetype === "application/octet-stream" &&
    WORD_EXTENSIONS.includes(getFileExtension(file.originalname))
  );
};

// =====================================================
// STORAGE
// =====================================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req: Request, file: Express.Multer.File) => {
    const folder = getUploadFolder(req);

    const isVideo = file.mimetype.startsWith("video/");
    const isPdf = file.mimetype === "application/pdf";
    const isWord = isWordFile(file);
    const isImage = file.mimetype.startsWith("image/");

    const fileName = sanitizeFileName(file.originalname);
    const extension = getFileExtension(file.originalname);

    const publicId = `${Date.now()}-${fileName}`;

    // PDF
    if (isPdf) {
      return {
        folder,
        resource_type: "raw",
        type: "upload",
        public_id: `${publicId}.${extension || "pdf"}`,
      } as any;
    }

    // WORD (.doc / .docx)
    if (isWord) {
      return {
        folder,
        resource_type: "raw",
        type: "upload",
        public_id: `${publicId}.${extension || "docx"}`,
      } as any;
    }

    // VIDEO
    if (isVideo) {
      return {
        folder,
        resource_type: "video",
        type: "upload",
        public_id: publicId,
      } as any;
    }

    // IMAGE
    if (isImage) {
      return {
        folder,
        resource_type: "image",
        type: "upload",
        public_id: publicId,

        transformation: [
          {
            width: 1200,
            height: 600,
            crop: "limit",
          },
        ],
      } as any;
    }

    // OTHER
    return {
      folder,
      resource_type: "raw",
      type: "upload",
      public_id: `${publicId}${extension ? `.${extension}` : ""}`,
    } as any;
  },
});

// =====================================================
// UPLOAD
// =====================================================

export const upload = multer({
  storage,

  limits: {
    fileSize: 500 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",

      // Videos
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",

      // PDF
      "application/pdf",

      // Word
      ...WORD_MIME_TYPES,
    ];

    const isAllowed = allowedTypes.includes(file.mimetype) || isWordFile(file);

    if (!isAllowed) {
      return cb(
        new Error(
          `Invalid file type: ${file.mimetype}. Only image, video, PDF and Word (.doc, .docx) files are allowed.`,
        ),
      );
    }

    cb(null, true);
  },
});

// =====================================================
// EXPORT
// =====================================================

export { cloudinary };
