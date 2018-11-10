import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(
  cors()
);


// Listen app with port 5000
app.listen(5000, function () {
  console.log(
    "Express app listening on port 5000 [YWC Rush!!!]"
  );
});

// Connect to mongoDB
const mongoURI = 'mongodb://localhost/owshine'
mongoose.connect(
  mongoURI, {
    auto_reconnect: true,
    useNewUrlParser: true
  }
);
mongoose.set('useFindAndModify', false);

// Routes
const router = require("./routes/router");
app.use("/", router);