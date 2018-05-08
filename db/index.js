const pgPromise = require('pg-promise');

// connection string
const url = 'postgres://sawfvfuhgbodzi:a4abeba9fbf3fba3bb8134413378835d3f2302d3433b5c497cd367b25d7c6b16@ec2-54-83-204-6.compute-1.amazonaws.com:5432/dpegr23c6jlp3';

const pgp = pgPromise({}); // empty pgPromise instance
const db = pgp(connStr); // get connection to your db instance
pgp.pg.defaults.ssl = true;

module.exports = db;