const express = require("express");
const app = express();
const port = process.env.PORT || 5004;
const cors = require("cors");

require("dotenv").config();

const cookieParser = require("cookie-parser");
const { addSuccessHandler } = require("./src/middleware/success-handler");
const error = require("./src/middleware/error-handler");
const { registerRoutes } = require("./src/routes");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

// mounting the router module on a path
app.use("/", registerRoutes());

// success handler, to make standard return
app.use(addSuccessHandler);

// JOI validation error
app.use(error.validationError);

//if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.addErrorHandler);

app.listen(port, async () => {
  try {
    var { dbConnection } = require("./src/db/dbConnection");
    await dbConnection();
    console.log(`App listening on port ${port}`);
  } catch (err) {
    console.log(
      "error",
      "Error from server.js : DB is not connected : Error details : " + err
    );
    process.exit(0);
  }
});
