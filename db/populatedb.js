#! /usr/bin/env node
require("dotenv").config();

const { Client } = require("pg");

const SQL = `

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR (255),
    last_name VARCHAR (255),
    email VARCHAR (255),
    password VARCHAR (255),
    status VARCHAR (255),
    admin boolean
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    content VARCHAR (255),
    post_date DATE
);

`;

async function main() {
  console.log("seeding...");
  try {
    const client = new Client({
      connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
  } catch (err) {
    console.error(err);
  }
}

main();
