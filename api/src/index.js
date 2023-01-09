const express = require('express');
const app = express()

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.listen(8134, () => {
    console.log('Serveur à l écoute')
})
