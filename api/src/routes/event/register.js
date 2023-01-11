const glob = require('../../global');
const jwt = require('jsonwebtoken');

module.exports = async function(app, con) {
    app.put("/event/register/:id", glob.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id) || !req.body.hasOwnProperty('users')) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!glob.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = glob.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" });
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows1) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                con.query(`SELECT admin_user_id FROM events WHERE id ="${req.params.id}";`, function (err1, rows) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else if (token_id === -2 || rows1[0]['permission_id'] === 2 || parseInt(token_id) === req.params.id) {
                        
                        con.query(`UPDATE users SET ${updateQueryString} WHERE id = "${req.params.id}";`, function (err2, result) {
                            if (err2) {
                                res.status(500).json({ msg: "Internal server error" });
                            } else
                                res.status(200).json( {msg: "event removed"} );
                        });
                    } else
                        res.status(403).json({ msg: "Authorization denied" });
                });
            }
        });

    });
}
