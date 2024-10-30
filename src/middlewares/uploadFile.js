const multer = require("multer");
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } = require("../config");
const maxFileSize = Number(MAX_FILE_SIZE);

const storage = multer.memoryStorage();

//file filter function
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  if (file.size > maxFileSize) {
    return cb(new Error("Max file size exceeded!"), false);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Invalid file type!"), false);
  }

  return cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
