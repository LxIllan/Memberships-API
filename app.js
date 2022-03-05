const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cron = require('node-cron');
const connectDB = require('./config/db');
const logger = require('./config/logger');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// DB Connection
connectDB();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(cors());

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/user'));
app.use('/', require('./routes/member'));
app.use('/', require('./routes/membership'));
app.use('/', require('./routes/property'));
app.use('/', require('./routes/receipt'));

app.use((err, req, res, next) => {    
    if (err.name === "UnauthorizedError") {
        logger.error(`UnauthorizedError. Method: ${req.method}, URL: ${req.url}.`);
        res.status(401).json({ error: 'Unauthorized!' });
    }
});

const {sendEmailEndMembership} = require('./controllers/member');

cron.schedule('0 13 * * *', () => {
    logger.info('Running a task at noon');
    sendEmailEndMembership();
});

app.listen(port, () => { logger.info(`NodeJS API listening on port ${port}.`) });