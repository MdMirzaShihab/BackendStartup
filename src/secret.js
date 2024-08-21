require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3000;
const MongodbURL = process.env.MONGODB_ATLAS_URL;
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || '/public/images/users/avatar.png';

module.exports = {serverPort, MongodbURL, defaultImagePath}