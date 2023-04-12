import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file type" }, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 },
});
