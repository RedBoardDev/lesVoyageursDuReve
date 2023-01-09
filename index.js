const express = require('express');
const app = express()








app.use(express.static('static'));

app.listen(8134, () => {
    console.log('Serveur à l écoute')
})

