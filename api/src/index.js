const express = require('express');
const bodyParser = require("body-parser");
const glob = require('./global');
const path = require('path');

glob.app.use(bodyParser.urlencoded({ extended: false }));
glob.app.use(express.static('static'));
glob.app.use(bodyParser.json());
glob.app.use(express.json());


// glob.con.connect(function(err) {
//     if (err) throw new Error(`Failed to connect to database lesvoyageursdureve`);
//     console.log("Connecté à la base de données lesvoyageursdureve");
// });

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

glob.app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../static/404.html'));
});

glob.app.listen(process.env.API_PORT, process.env.HOST_NAME, () => {
    console.log(`App listening at https://${process.env.HOST_NAME}:${process.env.API_PORT}`);
});

async function fetchDiscordInfo(discord_id_str) {
    var updateQueryString = '';
    try {
        const User = await glob.Client.grabProfile(discord_id_str);
        updateQueryString = addProperty(updateQueryString, 'discord_username', User['username']);
        updateQueryString = addProperty(updateQueryString, 'discord_avatar', (User['avatar']['url']).split("?")[0]);
    } catch (Error) {
        return updateQueryString;
    }
    return updateQueryString;
}

// setInterval(async () => {
//     glob.con.query(`SELECT id, discord_id FROM users WHERE discord_username <> "" OR discord_avatar <> "";`, function (err, rows) {
//         if (!err) {
//             for (let i = 0; i < rows.length; i++) {
//                 setTimeout(async () => {
//                     const updateQueryString = await fetchDiscordInfo((rows[i]['discord_id']).toString());
//                     if (updateQueryString.length > 0)
//                         glob.con.query(`UPDATE users SET ${updateQueryString} WHERE id = "${rows[i]['id']}";`, (err3, newRows) => {});
//                 }, 10000);
//             }
//         }
//     });
// }, (60000 * 60) * 12);
