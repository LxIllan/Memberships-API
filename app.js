const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron');
const express = require('express');
const logger = require('./config/logger');
const morgan = require('morgan');
const { sendEmailEndMembership } = require('./controllers/member');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// DB Connection
connectDB();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/user'));
app.use('/', require('./routes/member'));
app.use('/', require('./routes/membership'));
app.use('/', require('./routes/property'));
app.use('/', require('./routes/receipt'));

// Error unauthorized handler
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        logger.error(`UnauthorizedError. Method: ${req.method}, URL: ${req.url}.`);
        return res.status(401).json({ error: 'Unauthorized!' });
    }
});

// Cron job every day at noon
cron.schedule('0 13 * * *', () => {
    logger.info('Running a task at noon');
    sendEmailEndMembership();
});

// Start server
app.listen(port, () => { logger.info(`NodeJS API listening on port ${port}.`) });
