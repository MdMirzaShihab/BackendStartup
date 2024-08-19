const app = require('./app');
const {serverPort} = require('./secret');




app.listen(serverPort, ()=> {
    console.log(`Running at http://localhost:${serverPort}`)
});