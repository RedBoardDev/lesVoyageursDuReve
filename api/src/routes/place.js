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
    app.post("/place", async (req, res) => {
        if (!error_handling_values(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        con.query(`SELECT * FROM places WHERE name = "${req.body.name}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0] !== undefined)
                res.status(418).json({ msg: "Place already exists" });
            else {
                con.query(`INSERT INTO places(name, city, adresse) VALUES("${req.body["name"]}, ${req.body["city"]}, ${req.body["adresse"]}")`, function (err2, result) {
                    if (err2) {
                        console.log(err2);
                        res.status(500).json({ msg: "Internal server error" });
                    } else {
                        con.query(`SELECT * FROM places WHERE name = "${req.body.name}";`, function (err3, rows) {
                            if (err3)
                                res.status(500).json({ msg: "Internal server error" });
                            else if (rows !== undefined && rows[0] !== undefined) {
                                res.status(201).json({id: rows[0].id});
                            } else
                                res.sendStatus(404);
                        });
                    }
                });
            }
        });
    });
    app.get("/place", async (req, res) => {
        con.query(`SELECT * FROM places;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
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
        if (!glob.verifyAuth(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        con.query(`SELECT email FROM places WHERE id = ${req.params.id}`, function (err, rows) {
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
