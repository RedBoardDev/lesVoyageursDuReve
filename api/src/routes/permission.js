const glob = require('../global');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('permission_id')) {
        return false;
    }
    return true
}

module.exports = async function(app, con) {
    app.get("/permission/user/:id", glob.verifyToken, async (req, res) => {
        if (!glob.verifyAuth(req, res, true)) {
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
                con.query(`SELECT * FROM users WHERE id ="${req.params.id}";`, function (err, rows2) {
                    if (err)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json(rows2);
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.put("/permission/user/:id", glob.verifyToken, async (req, res) => {
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
            else if (rows[0]['permission_id'] === 2) {
                con.query(`UPDATE users SET permission_id = '${req.body.permission_id}' WHERE id = "${req.params.id}";`, function (err, rows2) {
                    if (err)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json(rows2);
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
