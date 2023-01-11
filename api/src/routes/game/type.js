const glob = require('../../global');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('name')) {
        return false;
    }
    if (!req.body.hasOwnProperty('color')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/game/type", glob.verifyToken, async (req, res) => {
        if (!error_handling_values(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!glob.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = glob.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" });
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0]['permission_id'] === 2) {
                con.query(`SELECT name FROM gameType WHERE name = "${req.body.name}";`, function (err, rows) {
                    if (err)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (rows[0] !== undefined)
                        res.status(418).json({ msg: "type already exists" });
                    else {
                        con.query(`INSERT INTO gameType(name, color) VALUES("${req.body["name"]}", "${req.body["color"]}")`, function (err2, result) {
                            if (err2)
                                res.status(500).json({ msg: "Internal server error" });
                            else
                                res.status(200).json( {msg: "type added"} );
                        });
                    }
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.get("/game/type", async (req, res) => {
        con.query(`SELECT * FROM gameType;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(rows);
        });
    });

    app.get("/game/type/:id", async (req, res) => {
        con.query(`SELECT * FROM gameType WHERE id ="${req.params.id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows[0]);
            }
        });
    });

    app.delete("/game/type/:id", glob.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!glob.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = glob.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" })
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0]['permission_id'] === 2) {
                con.query(`DELETE FROM gameType WHERE id = "${req.params.id}";`, function (err2, result) {
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
