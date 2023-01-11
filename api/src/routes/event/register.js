const glob = require('../../global');
const jwt = require('jsonwebtoken');

module.exports = async function(app, con) {
    app.put("/event/register/:id", glob.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.id) || !req.body.hasOwnProperty('user') || !glob.is_num(req.body.user)) {
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
            else if (token_id === -2 || rows1[0]['permission_id'] === 2 || token_id === req.body.user) {
                con.query(`SELECT user_registered_array FROM events WHERE id ="${req.params.id}";`, function (err1, rows) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else {
                        var arr = JSON.parse(rows[0]['user_registered_array']);
                        if (arr.indexOf(parseInt(req.body.user)) != -1) {
                            res.status(400).json({ msg: "user already register" });
                            return;
                        } else
                            arr.push(parseInt(req.body.user));
                        const user_registered_newList = JSON.stringify(arr);
                        con.query(`UPDATE events SET user_registered_array = '${user_registered_newList}' WHERE id = "${req.params.id}";`, function (err2, result) {
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
