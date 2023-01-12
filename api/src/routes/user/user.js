const glob = require('../../global');
const jwt = require('jsonwebtoken');

function get_id_user_route(req) {
    console.log("req.token", req.token)
    if (req.token === process.env.OTHER_APP_TOKEN)
        return -2;
    try {
        let decoded = jwt.verify(req.token, process.env.SECRET);
        return (decoded.id);
    } catch (err) {
        return (-1);
    }
}

function verifyToken_without_error(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof(bearerHeader) !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        next();
    }
}

module.exports = async function(app, con) {
    app.get("/user", verifyToken_without_error, async (req, res) => {
        let token_id = get_id_user_route(req);
        console.log("token_id", token_id)
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            var queryString = '';
            if (err || rows.length === 0)
                queryString = `id, username, discord_username, discord_avatar`;
            else if (token_id === -2)
                queryString = `*`;
            else if (rows[0]['permission_id'] === 2)
                queryString = `id, username, email, discord_id, discord_username, discord_avatar, permission_id, created_at`;
            else
                queryString = `id, username, discord_username, discord_avatar`;
            con.query(`SELECT ${queryString} FROM users;`, function (err, rows) {
                if (err)
                    res.status(500).json({ msg: "Internal server error" });
                else {
                    res.send(rows);
                }
            });
        });
    });

    app.get("/user/me", glob.verifyToken, async (req, res) => {
        let token_id = glob.get_id_with_token(req, res);
        if (token_id === - 1)
            return;
        const queryString = (req.token === process.env.OTHER_APP_TOKEN) ? `*` : `id, username, email, discord_id, permission_id, discord_username, discord_avatar, created_at`;
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
