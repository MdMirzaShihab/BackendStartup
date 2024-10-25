const multer = require("multer");
const path = require("path");
const { uploadDir, maximumFileSize, allowedFileTypes } = require("../secret");
const createError = require("http-errors");
const maxFileSize = Number(maximumFileSize);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname.replace(extName, "") + extName);
  },
});

const fileFilter = (req, file, cb) => {
    const extName = path.extname(file.originalname);
    if (!allowedFileTypes.includes(extName.substring(1))) {
        return cb(createError(422, "Only image files are allowed"));
    } 
    cb(null, true);
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: maxFileSize } }); 

module.exports = upload;
