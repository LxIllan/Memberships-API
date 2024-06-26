const { createLogger, format, transports } = require('winston')

const loggerFormat = format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.printf((log) => {
    return `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`
}));

const logger = createLogger({
    format: loggerFormat,
    transports: [
        new transports.File({ filename: 'app.log' }),
        new transports.Console()
    ]
});

module.exports = logger;