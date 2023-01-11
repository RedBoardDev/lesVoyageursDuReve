const bcrypt = require('bcryptjs');
const glob = require('../../global');

function addProperty(queryString, property, value) {
    if (queryString.length > 0)
        queryString += ", ";
    queryString += `${property} = '${value}'`;
    return queryString;
}

function getUpdateQueryString(req) {
    let updateQueryString = "";

    if (req.body.hasOwnProperty('password')) {
        const passwordHash = bcrypt.hashSync(req.body.password);
        updateQueryString = addProperty(updateQueryString, 'password', passwordHash);
    }
    if (req.body.hasOwnProperty('username'))
        updateQueryString = addProperty(updateQueryString, 'username', req.body.username);
    if (req.body.hasOwnProperty('email'))
        updateQueryString = addProperty(updateQueryString, 'email', req.body.email);
    if (req.body.hasOwnProperty('discord_id'))
        updateQueryString = addProperty(updateQueryString, 'discord_id', req.body.discord_id);
    return updateQueryString;
}

async function fetchDiscordInfo(updateQueryString, discord_id_str) {
    try {
        const User = await glob.Client.grabProfile(discord_id_str);
        updateQueryString = addProperty(updateQueryString, 'discord_username', User['username']);
        updateQueryString = addProperty(updateQueryString, 'discord_avatar', (User['avatar']['url']).split("?")[0]);
    } catch (Error) {
        return updateQueryString;
    }
    return updateQueryString;
}

module.exports = async function(app, con) {
    app.get("/user/id/:id", async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        const queryString = (req.token === process.env.OTHER_APP_TOKEN) ? `*` : `id, username, email, discord_id, permission_id, discord_username, discord_avatar, created_at`;
        con.query(`SELECT ${queryString} FROM users WHERE id = "${req.params.id}" OR email = "${req.params.id}" OR discord_id = "${req.params.id}";`, async function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0]) {
                res.send(rows[0]);
            } else
                res.sendStatus(404);
        });
    });

    app.put("/user/id/:id", glob.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!glob.verifyAuth(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        var updateQueryString = getUpdateQueryString(req);
        if (updateQueryString.length === 0) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        con.query(`SELECT email, discord_id FROM users WHERE id = ${req.params.id}`, async (err1, oldRows) => {
            if (err1)
                res.status(500).json({ msg: "Internal server error1" })
            else if (oldRows[0]) {
                updateQueryString = await fetchDiscordInfo(updateQueryString, (oldRows[0]['discord_id']).toString());
                con.query(`UPDATE users SET ${updateQueryString} WHERE id = "${req.params.id}";`, (err2, result) => {
                    if (err2) {
                        res.status(500).json({ msg: "Internal server error2" });
                    } else if (result.affectedRows > 0) {
                        const selectQueryString = (req.token === process.env.OTHER_APP_TOKEN) ? `*` : `id, username, email, discord_id, permission_id, discord_username, discord_avatar, created_at`;
                        con.query(`SELECT ${selectQueryString} FROM users WHERE id = "${req.params.id}";`, (err3, newRows) => {
                            if (err3)
                                res.status(500).json({ msg: "Internal server error3" });
                            else {
                                res.status(200).send(newRows[0]);
                            }
                        });
                    } else
                        res.sendStatus(404);
                });
            } else
                res.sendStatus(404);
        });
    });

    app.delete("/user/id/:id", glob.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!glob.verifyAuth(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        con.query(`SELECT email FROM users WHERE id = ${req.params.id}`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" })
            else {
                con.query(`DELETE FROM users WHERE id = "${req.params.id}";`, function (err, result) {
                    if (err)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (rows[0] && result.affectedRows !== 0) {
                        res.status(200).json({ msg: `Successfully deleted record number: ${req.params.id}` });
                    } else
                        res.sendStatus(404);
                });
            }
        });
    });
}
