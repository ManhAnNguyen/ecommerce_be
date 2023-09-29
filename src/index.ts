import "dotenv/config";
import "express-async-errors";

import { AppDataSource } from "./data-source";
import express from "express";
import { PORT } from "./config/env";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorHandle } from "./middlewares/handleError";

const app = express();

//serve cookie
app.use(cookieParser());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//serve static file
app.use(express.static("public"));

//handle err
app.use(errorHandle);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => console.log(`server up in ${PORT}`));
  })
  .catch((error) => console.log(error));
