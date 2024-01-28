require("dotenv").config();

const Pool = require("pg").Pool;

const NODE_ENV = process.env.NODE_ENV;

let POSTGRES_USER = process.env.POSTGRES_LOCAL_USER;
let POSTGRES_HOST = process.env.POSTGRES_LOCAL_HOST;
let POSTGRES_DATABASE = process.env.POSTGRES_LOCAL_DATABASE;
let POSTGRES_PASSWORD = process.env.POSTGRES_LOCAL_PASSWORD;
let POSTGRES_PORT = process.env.POSTGRES_LOCAL_PORT;

if (NODE_ENV === "production") {
    POSTGRES_USER = process.env.POSTGRES_SERVER_USER;
    POSTGRES_HOST = process.env.POSTGRES_SERVER_HOST;
    POSTGRES_DATABASE = process.env.POSTGRES_SERVER_DATABASE;
    POSTGRES_PASSWORD = process.env.POSTGRES_SERVER_PASSWORD;
    POSTGRES_PORT = process.env.POSTGRES_SERVER_PORT;
}

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    ssl: true,
});

module.exports = pool;
