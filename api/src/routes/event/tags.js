const tokenVerify = require('../../tokenVerify');
const DB_Userfunction = require('../../DB/users');
const DB_Tagsfunction = require('../../DB/tags');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('tags')) {
        return false;
    }
    return true;
}

function existInList(list, element) {
    return list.some(function(e) {
        return e['name'].toLowerCase() === element.toLowerCase();
    });
}

module.exports = async function(app, con) {
    app.post("/tags", tokenVerify.verifyToken, async (req, res) => {
        if (error_handling_values(req)) {
            res.status(400).json({ msg: "Bad parameter" });
            return;
        }
        if (!tokenVerify.verifyAuth_without_id(req, res, true)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        const tagsList = req.body['tags'].slice().split(", ");
        //convert...
        con.query(`SELECT name FROM tags;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                console.log(rows);
                for (let i = 0; i < tagsList.length; ++i) {
                    if (!existInList(rows, tagsList[i])) {
                        console.log("passed: ", tagsList[i]);
                        con.query(`INSERT INTO tags(name) VALUES("${tagsList[i]}")`, function (err, rows) {
                            if (err) {
                                res.status(500).json({ msg: "Internal server error" });
                                return;
                            }
                        });
                    }
                }
            }
            res.status(200).json({ msg: "Good" });
        });
        //convert...
        // DB_Tagsfunction.getTagById
    });

    app.get("/tags", async (req, res) => {
        con.query(`SELECT * FROM tags;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(rows);
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
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (token_id === -2 || rows[0]['permission_id'] === 2) {
                con.query(`DELETE FROM tags WHERE id = "${req.params.id}";`, function (err2, result) {
                    if (err2)
                        res.status(500).json({ msg: "Internal server error" });
                    else
                        res.status(200).json( {msg: "tags removed"} );
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });
}
