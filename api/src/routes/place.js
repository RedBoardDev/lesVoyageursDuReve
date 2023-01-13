const glob = require('../global');

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
    app.post("/place", glob.verifyToken, async (req, res) => {
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
            res.status(403).json({ msg: "Authorization denied" })
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || rows[0]['permission_id'] === 2) {
                con.query(`SELECT name, adresse FROM places WHERE name = "${req.body.name}";`, function (err, rows) {
                    if (err)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (rows[0] !== undefined)
                        res.status(418).json({ msg: "place already exists" });
                    else {
                        con.query(`INSERT INTO places(name, city, adresse) VALUES("${req.body["name"]}", "${req.body["city"]}", "${req.body["adresse"]}")`, function (err2, result) {
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
        con.query(`SELECT * FROM places;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(rows);
        });
    });

    app.get("/place/:id", async (req, res) => {
        con.query(`SELECT * FROM places WHERE id ="${req.params.id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
        });
    });

    app.delete("/place/:id", glob.verifyToken, async (req, res) => {
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
            else if (token_id === -2 || rows[0]['permission_id'] === 2) {
                con.query(`DELETE FROM places WHERE id = "${req.params.id}";`, function (err2, result) {
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
