const express = require('express')
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express()
const companyRouter = require('./routes/companyRoute')
const reviewRouter = require('./routes/reviewRouter')

app.use(helmet());
app.use(
    cors({
        origin: ['http://localhost:8080'],
        credentials: true,
    })
)

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'to many requests from this IP, pls try again in a hour',
    standardHeaders: true,
    legacyHeaders: false,
})

app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json());
app.use((req, res, next) => {
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.params);

    const queryCopy = { ...req.query }

    mongoSanitize.sanitize(queryCopy)

    req.querySanitized = queryCopy;

    next();
})

app.use('/api/v1/companies', companyRouter)
app.use('/api/v1/reviews', reviewRouter)

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'api is working'
    })
})

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)
module.exports = app;
