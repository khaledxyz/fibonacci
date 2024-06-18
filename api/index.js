// dependencies
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
const Redis = require("ioredis");
require("dotenv").config();

// express
const app = express();
app.use(cors());
app.use(parser.json());

// pg
const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.POSTGRES_URI });
db.on("error", (err) => {
  console.error("connection lost...", err);
});

db.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch((err) =>
  console.error("error creating table...", err)
);

// redis
const redis = new Redis(`redis://${process.env.REDIS_URI}`);

// routes
app.get("/api/hello-world", (req, res) => {
  res.send("Hello world!");
});

app.get("/api/values/all", async (req, res) => {
  const values = await db.query("SELECT * FROM values");
  res.send(values.rows);
});

app.get("/api/values/current", async (req, res) => {
  redis.hgetall("values", (err, values) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving values from Redis");
    } else {
      res.send(values);
    }
  });
});

app.post("/api/fibonacci/:index", async (req, res) => {
  const index = req.params.index;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redis.hset("values", index, "Nothing yet!");
  redis.publish("insert", index);
  db.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
