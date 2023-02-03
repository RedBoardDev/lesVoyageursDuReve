const DB_Userfunction = require('../../DB/users');
const DB_Eventfunction = require('../../DB/events');
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
    if (req.body.hasOwnProperty('tags')) {
        updateQueryString = addProperty(updateQueryString, 'tags', req.body.tags);
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
    if (!req.body.hasOwnProperty('tags')) {
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
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || data['permission_id'] >= 1) {
                DB_Eventfunction.createEvent({
                    "title": req.body["title"],
                    "description": req.body["description"],
                    "place_id": req.body["place_id"],
                    "place_custom": req.body["place_custom"],
                    "place_id": req.body["place_id"],
                    "tags": req.body["tags"],
                    "admin_user_id": token_id,
                    "user_registered_array": req.body["user_registered_array"],
                    "register_max": req.body["register_max"],
                    "date_start": req.body["date_start"],
                    "date_end": req.body["date_end"]
                }, con, function(err1) {
                    if (err1) {
                        res.status(500).json({ msg: "Internal server error" });
                    } else
                        res.status(200).json( {msg: "event added"} );
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.get("/event/all", async (req, res) => {
        DB_Eventfunction.getAllEvent(con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.get("/event/:id", async (req, res) => {
        DB_Eventfunction.getEventById(["*"], req.params.id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.put("/event/:id", tokenVerify.verifyToken, async (req, res) => {
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
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                DB_Eventfunction.getEventById(["admin_user_id"], req.params.id, con, function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (token_id === -2 || data['permission_id'] === 2 || (data['permission_id'] >= 1 && token_id === data1['admin_user_id'])) {
                        DB_Eventfunction.updateEvent(req.params.id, updateQueryString, con, function(err2) {
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
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" });
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                DB_Eventfunction.getEventById(["admin_user_id"], req.params.id, con, function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (token_id === -2 || data['permission_id'] === 2 || (data['permission_id'] >= 1 && token_id === data1['admin_user_id'])) {
                        DB_Eventfunction.deleteEvent(req.params.id, con, function(err2) {
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
