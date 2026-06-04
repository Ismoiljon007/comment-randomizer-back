import multer from "multer";
import { ValidationError } from "../utils/errors";

// Vercel serverless caps request bodies around 4.5MB, so keep the limit below that.
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const isExcel =
      /\.(xlsx|xls)$/i.test(file.originalname) ||
      file.mimetype.includes("spreadsheetml") ||
      file.mimetype.includes("excel");

    if (isExcel) {
      cb(null, true);
      return;
    }

    cb(new ValidationError("Only .xlsx files are accepted"));
  },
}).single("file");
