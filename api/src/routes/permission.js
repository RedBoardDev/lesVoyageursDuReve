const tokenVerify = require('../tokenVerify');
const DB_function = require('../DB/users');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('permission_id')) {
        return false;
    }
    return true
}

module.exports = async function(app, con) {
    app.get("/permission/user/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!tokenVerify.verifyAuth(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" })
        DB_function.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || data['permission_id'] === 2) {
                DB_function.getUserById(['permission_id'], req.params.id, con, function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json(data1);
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.put("/permission/user/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!error_handling_values(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" })
        DB_function.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || data['permission_id'] === 2) {
                DB_function.updateUser(req.params.id, {'permission_id': req.body.permission_id}, con, function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json({ msg: req.body.permission_id });
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
