const glob = require('../../global');

module.exports = async function(app, con) {
    app.post("/event", glob.verifyToken, async (req, res) => {
        if (!glob.verifyAuth(req, res, false)) {
            !res.headersSent ? res.status(403).json({ msg: "Authorization denied" }) : 0;
            return;
        }
        const queryString = (req.token === process.env.OTHER_APP_TOKEN) ? `*` : `id, title, description, place_id, game_id, game_title_id, admin_user_id, message, user_registered_array, date, duration, created_at`;
        con.query(`SELECT ${queryString} FROM users;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
        });
    });
    app.get("/event", glob.verifyToken, async (req, res) => {
        con.query(`SELECT * FROM users;`, function (err, rows) {
            if (err)
                res.status(500).json({ msg: "Internal server error" });
            else {
                res.send(rows);
            }
        });
    });
}