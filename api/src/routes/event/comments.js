const DB_Userfunction = require('../../DB/users');
const DB_Commentsfunction = require('../../DB/comments');
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
        if (token_id === -1) {
            res.status(403).json({ msg: "Authorization denied" });
            return;
        }
        DB_Commentsfunction.createComment({"event_id": req.body["event_id"], "user_id": token_id, "message": req.body["message"]}, con, function(err) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.status(200).json( {msg: "comment added"} );
        });
    });

    app.get("/comment/:event_id", async (req, res) => {
        DB_Commentsfunction.getCommentById(req.params.event_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(data);
        });
    });

    app.delete("/comment/:comment_id", tokenVerify.verifyToken, async (req, res) => {
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1) {
            res.status(403).json({ msg: "Authorization denied" });
            return;
        }
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function(err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                DB_Commentsfunction.getCommentById(req.params.comment_id, con, function (err1, data1) {
                    if (err1 || data1 === undefined)
                        res.status(500).json({ msg: "Internal server error" });
                    else if ((token_id === -2 || data['permission_id'] === 2) || token_id === data1['user_id']) {
                        DB_Commentsfunction.deleteComment(data1['id'], con, function (err2) {
                            if (err2)
                                res.status(500).json({ msg: "Internal server error" });
                            else
                                res.status(200).json({ msg: `Successfully deleted record number: ${req.params.event_id}` });
                        });
                    } else
                        res.status(403).json({ msg: "Authorization denied" });
                });
            }
        });
    });
}
