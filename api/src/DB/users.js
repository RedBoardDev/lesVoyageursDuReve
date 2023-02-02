let { v1: uuidv1 } = require("uuid")

function getAllUser(queryAttributes, DB, callback)
{
    const params = {
        TableName: "Users",
    };
    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data.Item)
    });
}

function getUserById(queryAttributes, id, DB, callback)
{
    const params = {
        TableName: "Users",
        Key: {
            id: { S: id },
        }
    };
    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data)
    });
}

function getUserByEmail(email, DB, callback)
{
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

function getUserByUsername(username, DB, callback)
{
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

function createUser(obj, DB, callback)
{

    if (!obj.username)
        obj["username"] = "0"
    if (!obj.email)
        obj["email"] = "0"
    if (!obj.password)
        obj["password"] = "0"
    if (!obj.discord_id)
        obj["discord_id"] = "0"
    if (!obj.discord_username)
        obj["discord_username"] = "0"
    if (!obj.discord_avatar)
        obj["discord_avatar"] = "0"
    if (!obj.permission_id)
        obj["permission_id"] = "0"

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
            created_at: { N: new Date().getTime().toString() },
        },
    };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateUser(id, obj, DB, callback)
{
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

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function deleteUser(id, DB, callback)
{
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

module.exports = {
    getAllUser,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
}
