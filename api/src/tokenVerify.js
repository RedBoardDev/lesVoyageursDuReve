const jwt = require('jsonwebtoken');

function checkFullAccessToken(token)
{
    if (token === process.env.API_TOKEN)
        return true;
    return false;
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof(bearerHeader) !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        if (checkFullAccessToken(req.token)) {
            next();
            return;
        }
        try {
            let decoded = jwt.verify(req.token, process.env.SECRET);
            con.query(`SELECT id FROM users WHERE id = "${decoded.id}";`, function (err2, rows) {
                if (err2) res.status(500).json({ msg: "Internal server error" });
                if (rows[0] && rows[0].id == decoded.id)
                    next();
                else
                    res.status(403).json({ msg: "Token is not valid" });
            });
        } catch (err) {
            res.status(403).json({ msg: "Token is not valid" });
        }
    } else {
        res.status(403).json({ msg: "No token, authorization denied" });
    }
}

function get_id_with_token(req, res) {
    if (checkFullAccessToken(req.token))
        return -2;
    try {
        let decoded = jwt.verify(req.token, process.env.SECRET);
        return (decoded.id);
    } catch (err) {
        res.status(403).json({ msg: "Token is not valid" });
    }
    return (-1);
}

function verifyAuth(req, res, verifId) {
    if (checkFullAccessToken(req.token))
        return true;
    if (verifId) {
        let token_id = get_id_with_token(req, res);
        if (token_id === -1)
            return false;
        return token_id === req.params.id;
    }
    return false;
}

function verifyAuth_without_id(req, res, verifId) {
    if (checkFullAccessToken(req.token))
        return true;
    if (verifId) {
        let token_id = get_id_with_token(req, res);
        if (token_id === -1)
            return false;
        return true;
    }
    return false;
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

exports.verifyAuth_without_id = verifyAuth_without_id;
exports.get_id_with_token = get_id_with_token;
exports.verifyToken = verifyToken;
exports.verifyAuth = verifyAuth;
exports.verifyToken_without_error = verifyToken_without_error;
