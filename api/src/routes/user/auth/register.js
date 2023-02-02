const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const glob = require('../../../global');
const DB_function = require('../../../DB/users');

function checkEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// function checkPassword(password) {
//     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)
// }

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
        DB_function.getUserByEmail(req.body.email, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (data != undefined)
                res.status(418).json({ msg: "Account already exists"});
            else {
                DB_function.createUser({ username: req.body["username"], email: req.body["email"], password: passwordHash, discord_id: "", discord_username: "", discord_avatar: "", permission_id: "0" }, DynamoDB, function (err1, data1) {
                    if (err1)
                    res.status(500).json({ msg: "Internal server error" });
                    else {
                        //TODO doing getUserByEmail and getUserByUsername with queryAttributes in argument and do not return all information
                        DB_function.getUserByEmail(req.body.email, con, function(err2, data2) {
                            if (err2)
                                res.status(500).json({ msg: "Internal server error" });
                            else {
                                let token = jwt.sign({ id: `${data2['id']}` }, process.env.SECRET, { expiresIn: '1w' });
                                res.status(201).json({token: token, id: data2['id']});
                            }
                        });
                    }
                });
            }
        });
    });
}
