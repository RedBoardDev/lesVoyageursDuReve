const glob = require('../../global');
const jwt = require('jsonwebtoken');

function get_id_user_route(req) {
    if (req.token === process.env.OTHER_APP_TOKEN)
        return (-2);
    try {
        let decoded = jwt.verify(req.token, process.env.SECRET);
        return (decoded.id === -1 ? -1: 0);
    } catch (err) {
        return (-1);
    }
}

module.exports = async function(app, con) {
    app.get("/user", async (req, res) => {
        const rsp = get_id_user_route(req);
        var queryString = '';
        if (rsp === -2)
            queryString = `*`;
        else if (rsp === 0)
            queryString = `id, username, discord_id, permission_id, discord_username, discord_avatar, created_at`;
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
