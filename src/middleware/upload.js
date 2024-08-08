import multer from "multer";
import fs from "fs";
import path from "path";

// Function to create the destination folder if it doesn't exist
const createFolderIfNotExists = (folderName) => {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
};

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folderName = path.join("uploads", folder);
      createFolderIfNotExists(folderName);
      cb(null, folderName);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

const validation = ["image/png", "image/gif", "image/jpeg", "image/jpg"];

const fileFilter = (req, file, cb) => {
  if (!validation.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter: fileFilter,
  });

export default upload;
