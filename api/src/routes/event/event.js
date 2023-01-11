const glob = require('../../global');

function error_handling_values(req) {
    if (!req.body.hasOwnProperty('title')) {
        return false;
    }
    if (!req.body.hasOwnProperty('description')) {
        return false;
    }
    if (!req.body.hasOwnProperty('place_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('game_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('game_type_id')) {
        return false;
    }
    if (!req.body.hasOwnProperty('date_start')) {
        return false;
    }
    if (!req.body.hasOwnProperty('date_end')) {
        return false;
    }
    return true;
}

module.exports = async function(app, con) {
    app.post("/event", glob.verifyToken, async (req, res) => {
        if (!error_handling_values(req)) {
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
        con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else if (rows[0]['permission_id'] >= 1) {
                con.query(`INSERT INTO events(title, description, place_id, game_id, game_type_id, admin_user_id, date_start, date_end) VALUES("${req.body["title"]}", "${req.body["description"]}", "${req.body["place_id"]}", "${req.body["game_id"]}", "${req.body["game_type_id"]}", "${token_id}", "${req.body["date_start"]}", "${req.body["date_end"]}")`, function (err2, result) {
                    if (err2) {
                        console.log(err2)
                        res.status(500).json({ msg: "Internal server error" });
                    } else
                        res.status(200).json( {msg: "event added"} );
                });
            } else
                res.status(403).json({ msg: "Authorization denied" });
        });
    });

    app.get("/event/all", async (req, res) => {
        con.query(`SELECT * FROM events;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else
                res.send(rows);
        });
    });


    app.get("/event/week/:date", async (req, res) => { // error handlings for params date c:
        con.query(`SELECT * FROM events;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                const date = (req.params.date);
                const year = parseInt(date.split("-")[0]);
                const month = parseInt(date.split("-")[1]);
                const day = parseInt((date.split("-")[2]).split("T")[0]);
                var new_row = [];
                for (let i = 0, a = 0; i < rows.length; i++) {
                    const elem_date_start = JSON.stringify(rows[i]['date_start']).replace('"', "");
                    const rows_year = parseInt(elem_date_start.split("-")[0]);
                    const rows_month = parseInt(elem_date_start.split("-")[1]);
                    const rows_day = parseInt(((elem_date_start.split("-")[2]) + '').split("T")[0]);
                    console.log(elem_date_start, rows_year, rows_month, rows_day)
                    if ((rows_year >= year && rows_year < year + 1)
                        && (rows_month >= month && rows_month < month + 1)
                        && (rows_day >= day && rows_day < day + 7)) {
                        console.log(rows[i])
                        new_row[a++] = rows[i];
                    }
                }
                res.send(new_row);
            }
        });
    });

    app.get("/event/:id", async (req, res) => { // error handlings for params id c:
        con.query(`SELECT * FROM events WHERE id ="${req.params.id}";`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
        });
    });
    // app.delete("/game/:id", glob.verifyToken, async (req, res) => {
    //     if (!glob.is_num(req.params.id)) {
    //         res.status(400).json({ msg: "Bad parameter" });
    //         return;
    //     }
    //     if (!glob.verifyAuth_without_id(req, res, true)) {
    //         !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
    //         return;
    //     }
    //     let token_id = glob.get_id_with_token(req, res);
    //     if (token_id === -1)
    //         res.status(403).json({ msg: "Authorization denied" })
    //     con.query(`SELECT permission_id FROM users WHERE id ="${token_id}";`, function (err, rows) {
    //         if (err)
    //             res.status(500).json({ msg: "Internal server error" });
    //         else if (rows[0]['permission_id'] === 2) {
    //             con.query(`DELETE FROM games WHERE id = "${req.params.id}";`, function (err2, result) {
    //                 if (err2)
    //                     res.status(500).json({ msg: "Internal server error" });
    //                 else
    //                     res.status(200).json( {msg: "games removed"} );
    //             });
    //         } else
    //             res.status(403).json({ msg: "Authorization denied" });
    //     });
    // });
}
