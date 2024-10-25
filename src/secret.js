require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3000;
const MongodbURL = process.env.MONGODB_ATLAS_URL;
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || '/public/images/users/avatar.png';
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'BACKUP_JWT_ACTIVATION_KEY';
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
const uploadDir = process.env.UPLOAD_FILE;
const maximumFileSize = process.env.MAX_FILE_SIZE;
const allowedFileTypes = process.env.ALLOWED_FILE_TYPES;


module.exports = {serverPort, MongodbURL, defaultImagePath, jwtActivationKey, smtpUsername, smtpPassword, clientURL, uploadDir, maximumFileSize, allowedFileTypes}   