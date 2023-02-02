let { v1: uuidv1 } = require("uuid")

function getUserById(id, DB, callback) {
    const params = {
        TableName: "Users",
        Key: {
            id: { S: id },
        }
    };

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data)
    });
}

function getUserByEmail(email, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": {
                S: email
            }
        },
        FilterExpression: "email = :a",
        TableName: "Users"
    };
    DB.scan(params, function (err, data) {
        if (callback) {
            callback(err, data.Items[0])
        }
    })
}

function getUserByUsername(username, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": {
                S: username
            }
        },
        FilterExpression: "username = :a",
        TableName: "Users"
    };
    DB.scan(params, function (err, data) {
        if (callback) {
            callback(err, data.Items[0])
        }
    })
}

function createUser(obj = { username: "", email: "", password: "", discord_id: "", discord_username: "", discord_avatar: "", permission_id: "" }, DB, callback) {
    const params = {
        TableName: "Users",
        Item: {
            id: { S: uuidv1() },
            username: { S: obj.username },
            email: { S: obj.email },
            password: { S: obj.password },
            discord_id: { S: obj.discord_id },
            discord_username: { S: obj.discord_username },
            discord_avatar: { S: obj.discord_avatar },
            permission_id: { S: obj.permission_id },
            created_at: { S: new Date().toISOString() },
        },
    };
    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateUser(id, obj, DB, callback) {
    let params = {
        TableName: "Users",
        Item: {
            id: { S: id }
        },
    };

    if (obj.username)
        params.Item["username"] = { S: obj.username };
    if (obj.email)
        params.Item["email"] = { S: obj.email };
    if (obj.password)
        params.Item["password"] = { S: obj.password };
    if (obj.discord_id)
        params.Item["discord_id"] = { S: obj.discord_id };
    if (obj.discord_username)
        params.Item["discord_username"] = { S: obj.discord_username };
    if (obj.discord_avatar)
        params.Item["discord_avatar"] = { S: obj.discord_avatar };
    if (obj.permission_id)
        params.Item["permission_id"] = { S: obj.permission_id };
    if (obj.created_at)
        params.Item["created_at"] = { S: obj.created_at };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function deleteUser(id, DB, callback) {
    const params = {
        TableName: "Users",
        Key: {
            id: { S: id },
        },
    };

    DB.deleteItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

// const AWS = require("aws-sdk");

// AWS.config.update({ region: 'global', endpoint: 'http://localhost:8000' });

// const DynamoDB = new AWS.DynamoDB();

module.exports = {
    getUserById,            //user by id, return undifined si user existe pas
    getUserByEmail,         //user by email, return undifined si user existe pas
    getUserByUsername,      //user by username, return undifined si user existe pas
    createUser,
    updateUser,
    deleteUser
}
