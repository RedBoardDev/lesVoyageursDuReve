const jwt = require('jsonwebtoken');
const tokenVerify = require('../../tokenVerify');
const DB_function = require('../../DB/users');

function get_id_user_route(req) {
    if (tokenVerify.checkFullAccessToken(req.token))
        return -2;
    try {
        let decoded = jwt.verify(req.token, process.env.SECRET);
        return (decoded.id);
    } catch (err) {
        return (-1);
    }
}

module.exports = async function (app, con) {
    app.get("/user", tokenVerify.verifyToken_without_error, async (req, res) => {
        let token_id = get_id_user_route(req);
        DB_function.getUserById(["permission_id"], token_id, con, function (err, data) {
            var queryString = '';
            if (token_id === -2)
                queryString = ["*"];
            else if (data && data['permission_id'] === 2)
                queryString = ["id", "username", "email", "discord_id", "discord_username", "discord_avatar", "permission_id", "created_at"];
            else
                queryString = ["id", "username", "discord_username", "discord_avatar", "created_at"];
            DB_function.getAllUser(queryString, con, function (err1, data1) {
                if (err1)
                    res.status(500).json({ msg: "Internal server error" });
                else if (data1 == undefined)
                    res.status(404).json({ msg: "Not found" });
                else
                    res.send(data1);
            });
        });
    });

    app.get("/user/me", tokenVerify.verifyToken, async (req, res) => {
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === - 1)
            return;
        const queryString = (tokenVerify.checkFullAccessToken(req.token)) ? ["*"] : ["id", "username", "email", "discord_id", "permission_id", "discord_username", "discord_avatar", "created_at"];
        DB_function.getUserById(queryString, token_id, con, function (err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (!data)
                res.status(404).json({ msg: "Not found" });
            else
                res.send(data);
        });
    });
}
