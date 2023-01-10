const glob = require('../../global');
const jwt = require('jsonwebtoken');

function error_handling_body(req) {
    if (!req.body.hasOwnProperty('token')) {
        return false;
    }
    return true;
}

function get_user_id_with_token(req, res) {
    try {
        let decoded = jwt.verify(req.body.token, process.env.SECRET);
        return (decoded.id);
    } catch (err) {
        console.log(err)
        res.status(403).json({ msg: "Token is not valid" });
    }
    return (-1);
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

    app.get("/user/:token", glob.verifyToken, async (req, res) => {
        if (!glob.verifyAuth(req, res, false)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        if (!error_handling_body(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        let token_id = get_user_id_with_token(req, res);
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
