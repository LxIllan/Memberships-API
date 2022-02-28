const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`🚀 ~ file: db.js ~ line 6 ~ conn`, conn.connection.host)
    } catch (error) {
        console.log(`file: db.js - line 8 - error`, error)
        process.exit(1);
    }
}

module.exports = connectDB;