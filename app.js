const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cron = require('node-cron')
const connectDB = require('./config/db')

require('dotenv').config();

const app = express();
const port = 3001 || 8080;

// DB Connection
connectDB()

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/member');
const membershipRoutes = require('./routes/membership')

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(cors());

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', memberRoutes);
app.use('/', membershipRoutes);

app.use((err, req, res, next) => {
    console.log("middleware unauthorizedError");
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});

const {sendEmailEndMembership} = require('./controllers/member');

cron.schedule('0 13 * * *', () => {
    console.log('Running a task at noon');
    sendEmailEndMembership();
});


const {getProperties} = require('./controllers/properties');
console.log(getProperties());

app.listen(port, () => { console.log(`NodeJS API listening on port ${port}`) });
