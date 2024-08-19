require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3000;
const MongodbURL = process.env.MONGODB_ATLAS_URL;

module.exports = {serverPort, MongodbURL}