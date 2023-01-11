const express = require('express');
const bodyParser = require("body-parser");
const glob = require('./global');

glob.app.use(bodyParser.urlencoded({ extended: false }));
glob.app.use(express.static('static'));
glob.app.use(bodyParser.json());
glob.app.use(express.json());

glob.con.connect(function(err) {
    if (err) throw new Error(`Failed to connect to database lesvoyageursdureve`);
    console.log("Connecté à la base de données lesvoyageursdureve");
});

glob.app.get("/quoi", (req, res) => {
    res.send("feur");
});

require('./routes/user/auth/register.js')(glob.app, glob.con);
require('./routes/user/auth/login.js')(glob.app, glob.con);
require('./routes/user/user.js')(glob.app, glob.con);
require('./routes/user/user_id.js')(glob.app, glob.con);
require('./routes/place.js')(glob.app, glob.con);
require('./routes/permission.js')(glob.app, glob.con);
require('./routes/game/type.js')(glob.app, glob.con);
require('./routes/game/game.js')(glob.app, glob.con);
require('./routes/event/comments.js')(glob.app, glob.con);
require('./routes/event/event.js')(glob.app, glob.con);
require('./routes/event/register.js')(glob.app, glob.con);

glob.app.listen(process.env.API_PORT, process.env.HOST_NAME, () => {
    console.log(`App listening at http://${process.env.HOST_NAME}:${process.env.API_PORT}`);
});
