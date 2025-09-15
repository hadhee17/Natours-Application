const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
// const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const app = express();
app.use(cors());

// Basic (allow everything – dev only)

// More secure: allow only your frontend
app.use(
  cors({
    origin: [
      // local dev
      'https://natours-application-z4zt.onrender.com/', // local dev
      // if frontend hosted separately
    ],
    credentials: true, // if you use cookies / JWT in cookies
  }),
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// 1) MIDDLEWARES
//security headers
app.use(helmet());
// app.use(cors());
const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
const styleSrcUrls = [
  'https://unpkg.com', // Leaflet CSS
  'https://tile.openstreetmap.org', // map tiles CSS
  'https://fonts.googleapis.com/', // Google Fonts
];
const connectSrcUrls = [
  'https://unpkg.com', // Leaflet fetch calls
  'https://tile.openstreetmap.org', // map tiles
  'https://natours-application-z4zt.onrender.com', // backend API
  'wss://natours-application-z4zt.onrender.com', // WebSocket
];
const fontSrcUrls = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

//set security http headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  }),
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);
app.use(compression());

app.use(express.json({ limit: '10kb' }));
//form data parsing
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);
// app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
