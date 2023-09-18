require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const path = require("path");
const errorHandle = require("./src/middlewares/handleError");
const handleJWT = require("./src/middlewares/handleJWT");
const PORT = process.env.PORT || 1308;

//serve cookie
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//serve static file
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

app.use("/auth", require("./src/routes/auth"));
app.use("/admin", require("./src/routes/admin"));
app.use("/user", require("./src/routes/users"));

//jwt
app.use(handleJWT);
app.use("/address", require("./src/routes/address"));

//handle error
app.use(errorHandle);

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
