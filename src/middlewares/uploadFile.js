const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, UPLOAD_USER_IMG_DIRECTORY } = require("../config");
const maxFileSize = Number(MAX_FILE_SIZE);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMG_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname.replace(extName, "") + extName);
  },
});

const fileFilter = (req, file, cb) => {
    const extName = path.extname(file.originalname);
    if (!ALLOWED_FILE_TYPES.includes(extName.substring(1))) {
        return cb(new Error ("Only " + ALLOWED_FILE_TYPES + " file types are allowed"), false);
    } 
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: maxFileSize } }); 

module.exports = upload;
