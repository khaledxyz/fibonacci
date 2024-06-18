const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_URI);
const sub = new Redis(process.env.REDIS_URI).duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// Listening for messages
sub.on("message", (channel, message) => {
  redis.hset("values", message, fib(parseInt(message)));
});

// Subscribe to the 'insert' channel
sub.subscribe("insert");
