const express = require('express')
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

app.use((err, req, res, next) => {
    console.log("middleware unauthorizedError");
    console.log(err)
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});

const {sendEmailEndMembership} = require('./controllers/member');

cron.schedule('0 13 * * *', () => {
    console.log('Running a task at noon');
    sendEmailEndMembership();
});

app.listen(port, () => { console.log(`NodeJS API listening on port ${port}`) });
