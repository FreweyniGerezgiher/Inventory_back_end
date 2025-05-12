module.exports = {
    dev: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        define: {
            timestamps: false,
        },
        dialectOptions: {
            // useUTC: false, //for reading from database
            dateStrings: true,
            typeCast(field, next) {
                // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            }
        },
        timezone: process.env.TIMEZONE || "+00:00",
        logging: false,
    },
};
