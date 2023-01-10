const glob = require('../../global');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('event_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('user_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('message')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/event/comment", glob.verifyToken, async (req, res) => {
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
            else if (rows[0]['permission_id'] >= 2) {
                    con.query(`INSERT INTO comments(event_id, user_id, message) VALUES("${req.body["event_id"]}", "${req.body["user_id"]}", "${req.body["message"]}")`, function (err2, result) {
                        if (err2)
                            res.status(500).json({ msg: "Internal server error" });
                        else
                            res.status(200).json( {msg: "comment added"} );
                    });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.get("/event/comment/:event_id", async (req, res) => {
        con.query(`SELECT * FROM comments WHERE event_id ="${req.params.event_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
        });
    });

    app.delete("/event/comment/:id", glob.verifyToken, async (req, res) => {
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
            else if (rows[0]['permission_id'] === 3) {
                con.query(`DELETE FROM comments WHERE id = "${req.params.id}";`, function (err2, result) {
                    if (err2)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json( {msg: "comment removed"} );
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
