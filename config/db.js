const mongoose = require('mongoose')
const logger = require('./logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        logger.info(`DB connection established to ${conn.connection.host}.`)
    } catch (error) {
        logger.error(error)
        process.exit(1);
    }
}

module.exports = connectDB;