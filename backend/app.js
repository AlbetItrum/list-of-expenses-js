const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRoutes = require("./src/modules/routes/routes");
const app = express();
require("dotenv").config();

// Sharing resources between origins
app.use(cors());

const url = process.env.MONGO_URI;
// The address of the database on the mongo server is passed. The method returns a Promise object
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use("/", apiRoutes);
// To start the server, the listen() method is called, which is passed the port number
app.listen(process.env.PORT, () => console.log(`Running on oprt: 8080`));
