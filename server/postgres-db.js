require("dotenv").config();

const Pool = require("pg").Pool;

const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_PORT = process.env.POSTGRES_PORT;

const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
});

module.exports = pool;