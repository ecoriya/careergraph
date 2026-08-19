const neo4j = require("neo4j-driver");

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password)
);

module.exports = driver;