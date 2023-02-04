const tokenVerify = require('../../tokenVerify');
const DB_Userfunction = require('../../DB/users');
const DB_Tagsfunction = require('../../DB/tags');

function existInList(list, element) {
    return list.some(function (e) {
        return e['name'].toLowerCase() === element.toLowerCase();
    });
}

module.exports = async function (app, con) {
    app.post("/tags", tokenVerify.verifyToken, async (req, res) => {
        if (!req.body.hasOwnProperty('tags')) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        const tagsList = req.body['tags'].slice().split(", ");
        DB_Tagsfunction.getAllTag(con, function (err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                for (let i = 0; i < tagsList.length; ++i) {
                    if (!data || !existInList(data, tagsList[i])) {
                        DB_Tagsfunction.createTag({ "name": tagsList[i] }, con, function (err1) {
                            if (err1) {
                                res.status(500).json({ msg: "Internal server error" });
                                return;
                            }
                        });
                    }
                }
            }
            res.status(201).json({ msg: "Created" });
        });
    });

    app.get("/tags", async (req, res) => {
        DB_Tagsfunction.getAllTag(con, function (err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (data == undefined)
                res.send([]);
            else
                res.send(data);
        });
    });

    app.delete("/tags/:id", tokenVerify.verifyToken, async (req, res) => {
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        let token_id = tokenVerify.get_id_with_token(req, res);
        if (token_id === -1)
            res.status(403).json({ msg: "Authorization denied" })
        DB_Userfunction.getUserById(['permission_id'], token_id, con, function (err, data) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || parseInt( data['permission_id']) === 2) {
                DB_Tagsfunction.deleteTag(req.params.id, con, function (err1) {
                    if (err1)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json({ msg: "tags removed" });
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
