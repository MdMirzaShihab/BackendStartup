const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const categoryRouter = require('./routers/categoryRouter');
const createError = require('http-errors');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseController');


const rateLimiter = rateLimit(
    {
        windowMs: 1*60*1000,
        limit: 5,
        Message: 'Too many request from this IP, please try again later.'
    }
)


const app = express();

app.use(morgan("dev"));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);

app.use('/api/seed', seedRouter);


app.get("/", rateLimiter, (req, res)=> {
    res.status(200).send({
        Message: "Hello to homepage of our server"
    })
});

// client error handling
app.use((req, res, next)=> {
    next(createError(404, 'route not found'));
});

// Server error handling
app.use((err, req, res, next)=> {
    return errorResponse (res, {
        statusCode: err.status,
        message: err.message,
    })
});


module.exports = app;