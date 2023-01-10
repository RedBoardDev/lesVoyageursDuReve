const glob = require('../../global');
const jwt = require('jsonwebtoken');

function error_handling_body(req) {
    if (!req.body.hasOwnProperty('token')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.get("/user", glob.verifyToken, async (req, res) => {
        if (!glob.verifyAuth(req, res, false)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        const queryString = (req.token === process.env.OTHER_APP_TOKEN) ? `*` : `id, username, email, discord_id, permission_id, created_at`;
        con.query(`SELECT ${queryString} FROM users;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
        });
    });

    app.get("/user/me", glob.verifyToken, async (req, res) => {
        let token = req.token;
        if (!glob.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = glob.get_id_with_token(req, res);
        if (token_id === - 1)
            return;
        const queryString = (req.token === process.env.OTHER_APP_TOKEN) ? `*` : `id, username, email, discord_id, permission_id, created_at`;
        con.query(`SELECT ${queryString} FROM users WHERE id = "${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0]) {
                res.send(rows[0]);
            } else
                res.sendStatus(404);
        });
    });
}
