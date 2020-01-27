const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const databaseHelpers = require('./helpers/databaseHelpers');
const endpoints = require('./helpers/endpoints');
const { handleError } = require('./helpers/error')
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

endpoints(app);

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, () => {
  console.log("Server started on port: ", port);
  databaseHelpers.initiateDatabase();
});