const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const glob = require('../../../global');

function checkEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function checkPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)
}

function error_handling_register(req) {
    if (!req.body.hasOwnProperty('username')) {
        return false;
    }
    if (!req.body.hasOwnProperty('email')) {
        return false;
    }
    if (!req.body.hasOwnProperty('password')) {
        return false;
    }
    if (!checkEmail(req.body.email))
        return false;
    return true;
}

module.exports = async function(app, con) {
    app.post("/user/register", async (req, res) => {
        if (!error_handling_register(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        const passwordHash = bcrypt.hashSync(req.body['password']);
        con.query(`SELECT * FROM users WHERE email = "${req.body.email}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0] !== undefined)
                res.status(418).json({ msg: "Account already exists"});
            else {
                con.query(`INSERT INTO users(username, email, password) VALUES("${req.body["username"]}", "${req.body["email"]}", "${passwordHash}")`, function (err2, result) {
                    if (err2) {
                        res.status(500).json({ msg: "Internal server error" });
                    } else {
                        con.query(`SELECT * FROM users WHERE email = "${req.body.email}";`, function (err3, rows) {
                            if (err3)
                                res.status(500).json({ msg: "Internal server error" });
                            else if (rows !== undefined && rows[0] !== undefined) {
                                let token = jwt.sign({ id: `${rows[0].id}` }, process.env.SECRET, { expiresIn: '1w' });
                                res.status(201).json({token: token, id: rows[0].id});
                            } else
                                res.sendStatus(404);
                        });
                    }
                });
            }
        });
    });
}
