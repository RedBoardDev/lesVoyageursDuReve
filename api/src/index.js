const express = require('express');
const bodyParser = require("body-parser");
const app = express()
require('dotenv').config();

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/quoi", (req, res) => {
    res.send("feur");
});

const API_HOST = process.env.API_HOST;
const API_PORT = process.env.API_PORT;

app.listen(API_PORT, API_HOST, () => {
    console.log(`App listening at http://${API_HOST}:${API_PORT}`);
})
