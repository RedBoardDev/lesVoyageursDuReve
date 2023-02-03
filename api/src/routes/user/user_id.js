const bcrypt = require('bcryptjs');
const glob = require('../../global');
const tokenVerify = require('../../tokenVerify');
const DB_function = require('../../DB/users');

function getUpdateQueryString(req, permission) {
    let updateQueryString = "";

    if (req.body.hasOwnProperty('password')) {
        const passwordHash = bcrypt.hashSync(req.body.password);
        updateQueryString = glob.addProperty(updateQueryString, 'password', passwordHash);
    }
    if (req.body.hasOwnProperty('username'))
        updateQueryString = glob.addProperty(updateQueryString, 'username', req.body.username);
    if (req.body.hasOwnProperty('email'))
        updateQueryString = glob.addProperty(updateQueryString, 'email', req.body.email);
    if (req.body.hasOwnProperty('discord_id'))
        updateQueryString = glob.addProperty(updateQueryString, 'discord_id', req.body.discord_id);
    if (permission === true && req.body.hasOwnProperty('permission_id'))
    updateQueryString = glob.addProperty(updateQueryString, 'discord_id', req.body.discord_id);
    return updateQueryString;
}

async function fetchDiscordInfo(updateQueryString, discord_id_str) {
    try {
        const User = await glob.Client.grabProfile(discord_id_str);
        updateQueryString = glob.addProperty(updateQueryString, 'discord_username', User['username']);
        updateQueryString = glob.addProperty(updateQueryString, 'discord_avatar', (User['avatar']['url']).split("?")[0]);
    } catch (Error) {
        return updateQueryString;
    }
    return updateQueryString;
}

module.exports = async function(app, con) {
    app.get("/user/id/:id", async (req, res) => { //TODO for email or discord_id ?
        const queryString = (tokenVerify.checkFullAccessToken(req.token)) ? ["*"] : ["id", "username", "email", "discord_id", "permission_id", "discord_username", "discord_avatar", "created_at"];
        DB_function.getUserById(queryString, req.params.id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.get("/user/email/:email", async (req, res) => {
        const queryString = (tokenVerify.checkFullAccessToken(req.token)) ? ["*"] : ["id", "username", "email", "discord_id", "permission_id", "discord_username", "discord_avatar", "created_at"];
        DB_function.getUserByEmail(queryString, req.params.email, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.get("/user/discordID/:discordID", async (req, res) => {
        const queryString = (tokenVerify.checkFullAccessToken(req.token)) ? ["*"] : ["id", "username", "email", "discord_id", "permission_id", "discord_username", "discord_avatar", "created_at"];
        DB_function.getUserByDiscordID(queryString, req.params.discordID, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.put("/user/id/:id", tokenVerify.verifyToken, async (req, res) => {
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1) {
            res.status(403).json({ msg: "Authorization denied" })
            return;
        }
        DB_function.getUserById(["permission_id"], token_id, con, function(err, data) {
            if (err) {
                res.status(500).json({ msg: "Internal server error" });
                return;
            }
            if (data === undefined) {
                res.status(500).json({ msg: "User not found" });
                return;
            }
            if (data['permission_id'] === 2 || (data['permission_id'] === 1 && token_id === req.params.id)) {
                DB_function.getUserById(["email", "discord_id", "discord_username", "discord_avatar"], req.params.id, con, async function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (data1) {
                        var updateQueryString = getUpdateQueryString(req, rows1[0]['permission_id'] === 2);
                        if (updateQueryString.length === 0) {
                            res.status(400).json({ msg: "Bad parameter" });
                            return;
                        }
                        if (data1['discord_username'] === "0" || data1['discord_avatar'] === "0")
                            updateQueryString = await fetchDiscordInfo(updateQueryString, (oldRows[0]['discord_id']).toString());
                        DB_function.updateUser(req.params.id, {}, con, function(err2) {
                            if (err2)
                                res.status(500).json({ msg: "Internal server error" });
                            else {
                                var selectQueryString = '';
                                if (tokenVerify.checkFullAccessToken(req.token))
                                    selectQueryString= ["*"];
                                else if (data['permission_id'] === 2)
                                    selectQueryString = ["id", "username", "email", "discord_id", "permission_id", "discord_username", "discord_avatar", "created_at"];
                                else
                                    selectQueryString = ["id", "username", "email", "discord_id", "discord_username", "discord_avatar", "created_at"];
                                DB_function.getUserById(selectQueryString, req.params.id, con, function(err3, data3) {
                                    if (err3)
                                        res.status(500).json({ msg: "Internal server error" });
                                    else
                                        res.status(200).send(data3);
                                });
                            }
                        });
                    } else
                        res.sendStatus(404);
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });

    });

    app.delete("/user/id/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1) {
            res.status(403).json({ msg: "Authorization denied" })
            return;
        }
        DB_function.getUserById(["permission_id"], token_id, con, function(err, data) {
            if (err) {
                res.status(500).json({ msg: "Internal server error" });
                return;
            }
            if (data === undefined) {
                res.status(500).json({ msg: "User not found" });
                return;
            }
            if (data['permission_id'] === 2) {
                DB_function.getUserById(["email"], req.params.id, con, function(err1, data1) {
                    if (err1) {
                        res.status(500).json({ msg: "Internal server error" });
                        return;
                    }
                    if (data === undefined) {
                        res.status(500).json({ msg: "User not found" });
                        return;
                    }
                    DB_function.deleteUser(req.params.id, con, function(err1) {
                        if (err1)
                            res.status(500).json({ msg: "Internal server error" });
                        else
                            res.status(200).json({ msg: `Successfully deleted record number: ${req.params.id}` });
                    });
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });

    });
}
