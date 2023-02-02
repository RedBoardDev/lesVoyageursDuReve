const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const { Discord } = require("discord-id");
const path = require('path');
const AWS = require("aws-sdk");

dotenv.config( {"path" : path.join(__dirname, "../../.env" ) });
const Client = new Discord(process.env.DISCORD_BOT_TOKEN);

const app = express();
const algorithm = 'aes-256-cbc';

AWS.config.update({ region: 'global', endpoint: 'http://localhost:8000' });
const con = new AWS.DynamoDB();

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

function addProperty(queryString, property, value) {
    if (queryString.length > 0)
        queryString += ", ";
    queryString += `${property} = '${value}'`;
    return queryString;
}

function is_num(id) {
    return (/^\d+$/.test(id));
}

exports.app = app;
exports.con = con;
exports.Client = Client;
exports.encryptString = encryptString;
exports.decryptString = decryptString;
exports.is_num = is_num;
exports.addProperty = addProperty;
