const express = require('express');
const bodyParser = require("body-parser");
const glob = require('./global');
const path = require('path');

glob.app.use(bodyParser.urlencoded({ extended: false }));
glob.app.use(bodyParser.json());
glob.app.use(express.json());


glob.app.get("/health", (req, res) => {
    res.send("PlaneIsPlaneButPlaneIsn'tPlane");
});

require('./routes/user/auth/register.js')(glob.app, glob.con);
require('./routes/user/auth/login.js')(glob.app, glob.con);
require('./routes/user/user.js')(glob.app, glob.con);
require('./routes/user/user_id.js')(glob.app, glob.con);
require('./routes/place.js')(glob.app, glob.con);
require('./routes/permission.js')(glob.app, glob.con);
require('./routes/event/comments.js')(glob.app, glob.con);
require('./routes/event/event.js')(glob.app, glob.con);
require('./routes/event/register.js')(glob.app, glob.con);
require('./routes/event/unregister.js')(glob.app, glob.con);
require('./routes/event/tags.js')(glob.app, glob.con);

if (process.env.PROD == '0') {
    glob.app.use(express.static('../static'));

    glob.app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../../static/404.html'));
    });
}


glob.app.listen(process.env.API_PORT, process.env.HOST_NAME, () => {
    console.log(`App listening at https://${process.env.HOST_NAME}:${process.env.API_PORT}`);
});
