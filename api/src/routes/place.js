const DB_Userfunction = require('../DB/users');
const DB_Placefunction = require('../DB/places');
const tokenVerify = require('../tokenVerify');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('name')) {
        return false;
    }
    if (!req.body.hasOwnProperty('city')) {
        return false;
    }
    if (!req.body.hasOwnProperty('adresse')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/place", tokenVerify.verifyToken, async (req, res) => {
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
            res.status(403).json({ msg: "Authorization denied" })
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || data['permission_id'] === 2) {
                DB_Placefunction.getPlaceByName(req.body.name, con, function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (data1 !== undefined)
                        res.status(418).json({ msg: "place already exists" });
                    else {
                        DB_Placefunction.createPlace({ name: req.body["name"], city: req.body["city"], adresse: req.body["adresse"] }, con, function(err2) {
                            if (err2)
                                res.status(500).json({ msg: "Internal server error" });
                            else
                                res.status(200).json( {msg: "place added"} );
                        });
                    }
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.get("/place", async (req, res) => {
        DB_Placefunction.getAllPlace(con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.get("/place/:id", async (req, res) => {
        DB_Placefunction.getPlaceById(req.params.id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.delete("/place/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" })
        DB_Userfunction.getUserById(["permission_id"], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || data['permission_id'] === 2) {
                DB_Placefunction.deletePlace(req.params.id, con, function(err2) {
                    if (err2)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json( {msg: "place removed"} );
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
