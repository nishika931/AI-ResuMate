const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database is connected successfully");
  })
  .catch((err) => {
    console.log("something error", err);
  });