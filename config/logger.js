const { createLogger, transports, format } = require('winston')

const loggerFormat = format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), format.printf((log) => {
    return `${log.timestamp} [${log.level.toUpperCase()}] ${log.message}`
}))

const logger = createLogger({
    format: loggerFormat,
    transports: [
        new transports.File({filename: 'memberships.log'}),
        new transports.Console()
    ]
});

module.exports = logger;