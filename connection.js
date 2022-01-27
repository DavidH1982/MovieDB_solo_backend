const { Sequelize } = require("sequelize");

let connection;

if (process.env.NODE_ENV === "PRODUCTION") {
    module.exports.connection = new Sequelize(`${process.env.DATABASE_URL}?sslmode=require`, {
        url: process.env.DATABASE_URI,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                rejectUnauthorize: false
            },
        }
    })
} else {
    module.exports.connection = new Sequelize(process.env.DB_URI);
    console.log("Connection to DB Successful!");
}

module.exports = connection;