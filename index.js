require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const http = require("http");
const app = express();
const logger = require('./src/utils/logger')
const user = require('./src/routes/user/user')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DBNAME,
  })
  .then(() => {
    logger.info("Connected to the database")
  })
  .catch((error) => {
    logger.info( `Error Connecting to the database: ${error.message}`)
  });

app.use("/api", user);
app.use("/api", require('./src/routes/Book/book'));
app.use("/api", require('./src/routes/review/review'));
// app.use("/api", require('./src/routes/Book/book'));



const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
});