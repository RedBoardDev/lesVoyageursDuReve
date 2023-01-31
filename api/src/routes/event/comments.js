const glob = require('../../global');
const tokenVerify = require('../../tokenVerify');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('event_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('message')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/comment", tokenVerify.verifyToken, async (req, res) => {
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
            res.status(403).json({ msg: "Authorization denied" });
                con.query(`INSERT INTO comments(event_id, user_id, message) VALUES("${req.body["event_id"]}", "${token_id}", "${req.body["message"]}")`, function (err2, result) {
                    if (err2)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json( {msg: "comment added"} );
                });
    });

    app.get("/comment/:event_id", async (req, res) => {
        if (!glob.is_num(req.params.event_id)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        con.query(`SELECT * FROM comments WHERE event_id = "${req.params.event_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(rows);
        });
    });

    app.delete("/comment/:comment_id", tokenVerify.verifyToken, async (req, res) => {
        if (!glob.is_num(req.params.comment_id)) {
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
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows1) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                con.query(`SELECT id, user_id FROM comments WHERE id ="${req.params.comment_id}";`, function (err1, rows2) {
                    if (err1 || rows2.length === 0)
                        res.status(500).json({ msg: "Internal server error" });
                    else if ((token_id === -2 || rows1[0]['permission_id'] === 2) || parseInt(token_id) === rows2[0]['user_id']) {

                        con.query(`DELETE FROM comments WHERE id = "${rows2[0]['id']}";`, function (err, result) {
                            if (err)
                                res.status(500).json({ msg: "Internal server error" });
                            else if (rows1[0] && result.affectedRows !== 0) {
                                res.status(200).json({ msg: `Successfully deleted record number: ${req.params.event_id}` });
                            } else
                                res.sendStatus(404);
                        });

                    } else
                        res.status(403).json({ msg: "Authorization denied" });
                });
            }
        });
    });
}
