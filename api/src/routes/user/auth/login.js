const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB_function = require('../../../DB/users');

function error_handling_login(req) {
    if(!req.body.hasOwnProperty('email')) {
        return false;
    }
    if(!req.body.hasOwnProperty('password')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/user/login", async (req, res) => {
        if (!error_handling_login(req)) {
            res.status(400).json({ msg: "Invalid Credentials" });
            return;
        }
        DB_function.getUserByEmail(req.body.email, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (data = undefined)
                res.status(400).json({ msg: "Invalid Credentials" });
            else if (bcrypt.compareSync(req.body.password, rows[0].password)) {
                let token = jwt.sign({ id: `${rows[0].id}` }, process.env.SECRET, { expiresIn: '1w' });
                res.status(201).json({token: token, id: rows[0].id});
            } else
                res.status(400).json({ msg: "Invalid Credentials" });
        });
    });
}
