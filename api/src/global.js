const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Discord } = require("discord-id");
const path = require('path');


dotenv.config( {"path" : path.join(__dirname, "../../.env" ) });
const Client = new Discord(process.env.DISCORD_BOT_TOKEN);

const app = express();
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'lesvoyageursdureve'
});
const algorithm = 'aes-256-cbc';

function encryptString(text) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.SECRET, 'utf8'), iv);
    return JSON.stringify({ i: iv.toString('hex'), e: Buffer.concat([cipher.update(text), cipher.final()]).toString('hex') });
}

function decryptString(text) {
    text = JSON.parse(text);
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.SECRET, 'utf8'), Buffer.from(text.i, 'hex'));
    return Buffer.concat([decipher.update(Buffer.from(text.e, 'hex')), decipher.final()]).toString();
}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof(bearerHeader) !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        if (req.token === process.env.API_TOKEN) {
            next();
            return;
        }
        try {
            let decoded = jwt.verify(req.token, process.env.SECRET);
            con.query(`SELECT id FROM users WHERE id = "${decoded.id}";`, function (err2, rows) {
                if (err2) res.status(500).json({ msg: "Internal server error" });
                if (rows[0] && rows[0].id == decoded.id)
                    next();
                else
                    res.status(403).json({ msg: "Token is not valid" });
            });
        } catch (err) {
            res.status(403).json({ msg: "Token is not valid" });
        }
    } else {
        res.status(403).json({ msg: "No token, authorization denied" });
    }
}

function get_id_with_token(req, res) {
    if (req.token === process.env.API_TOKEN)
        return -2;
    try {
        let decoded = jwt.verify(req.token, process.env.SECRET);
        return (decoded.id);
    } catch (err) {
        res.status(403).json({ msg: "Token is not valid" });
    }
    return (-1);
}

function verifyAuth(req, res, verifId) {
    if (req.token === process.env.API_TOKEN)
        return true;
    if (verifId) {
        let token_id = get_id_with_token(req, res);
        if (token_id === -1)
            return false;
        return token_id === req.params.id;
    }
    return false;
}

function verifyAuth_without_id(req, res, verifId) {
    if (req.token === process.env.API_TOKEN)
        return true;
    if (verifId) {
        let token_id = get_id_with_token(req, res);
        if (token_id === -1)
            return false;
        return true;
    }
    return false;
}

function is_num(id) {
    return (/^\d+$/.test(id));
}

exports.app = app;
exports.con = con;
exports.Client = Client;
exports.verifyAuth_without_id = verifyAuth_without_id;
exports.get_id_with_token = get_id_with_token;
exports.encryptString = encryptString;
exports.decryptString = decryptString;
exports.verifyToken = verifyToken;
exports.verifyAuth = verifyAuth
exports.is_num = is_num;
