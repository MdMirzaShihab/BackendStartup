const app = require('./app');
const connectDB = require('./config/db');
const {serverPort} = require('./secret');



app.listen(serverPort, async ()=> {
    await connectDB()
    console.log(`Server is running on port ${serverPort}`);
});