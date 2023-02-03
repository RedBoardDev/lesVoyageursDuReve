const tokenVerify = require('../../tokenVerify');
const DB_Userfunction = require('../../DB/users');
const DB_Eventfunction = require('../../DB/event');

module.exports = async function(app, con) {
    app.put("/event/unregister/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!req.body.hasOwnProperty('user')) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" });
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || data['permission_id'] === 2 || token_id === req.body.user) {
                DB_Eventfunction.getEventById(['user_registered_array'], req.params.id, con, function(err1, data1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else {
                        var arr = JSON.parse(data1['user_registered_array']);
                        if (arr.indexOf(req.body.user) === -1) {
                            res.status(400).json({ msg: "user not register" });
                            return;
                        } else
                            arr.splice(arr.indexOf(req.body.user), 1);
                        const user_registered_newList = JSON.stringify(arr);
                        DB_Eventfunction.updateEvent(req.params.id, { "user_registered_array": user_registered_newList }, con, function(err2) {
                            if (err2) {
                                res.status(500).json({ msg: "Internal server error" });
                            } else
                                res.status(200).json( {msg: user_registered_newList} );
                        });
                    }
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
