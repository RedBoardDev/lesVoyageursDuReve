let { v1: uuidv1 } = require("uuid")

function getAllUser(queryAttributes, DB, callback) {
    const params = {
        TableName: "Users",
    };
    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.scan(params, function (err, data) {
        if (callback) {
            if (data && data.Count >= 1)
                callback(err, data.Items)
            else
                callback(err, undefined)
        }
    });
}

function getUserById(queryAttributes, id, DB, callback) {
    const params = {
        TableName: "Users",
        Key: {
            "id": id,
        }
    };
    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.get(params, function (err, data) {
        if (callback) {
            if (data)
                callback(err, data.Item)
            else
                callback(err, undefined)
        }
    });
}

function getUserByEmail(queryAttributes, email, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": email
        },
        FilterExpression: "email = :a",
        TableName: "Users"
    };
    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.scan(params, function (err, data) {
        if (callback) {
            if (data && data.Count >= 1) {
                callback(err, data.Items[0])
            } else {
                callback(err, undefined)
            }
        }
    })
}

function getUserByDiscordID(queryAttributes, discordID, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": discordID
        },
        FilterExpression: "discord_id = :a",
        TableName: "Users"
    };

    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.scan(params, function (err, data) {
        if (callback) {
            if (data && data.Count >= 1) {
                callback(err, data.Items[0])
            } else {
                callback(err, undefined)
            }
        }
    })
}

function createUser(obj, DB, callback) {

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
        obj["permission_id"] = "2"          //! set good default perm

    obj.id = uuidv1();
    obj.created_at = new Date().getTime().toString();

    const params = {
        TableName: "Users",
        Item: obj,
    };

    DB.put(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateUser(id, obj, DB, callback) {

    getUserById(["*"], id, DB, (err, data) => {
        if (err)
            callback(err)
        else {
            if (!obj.username)
                obj.username = data.username
            if (!obj.email)
                obj.email = data.email
            if (!obj.password)
                obj.password = data.password
            if (!obj.discord_id)
                obj.discord_id = data.discord_id
            if (!obj.discord_username)
                obj.discord_username = data.discord_username
            if (!obj.discord_avatar)
                obj.discord_avatar = data.discord_avatar
            if (!obj.permission_id)
                obj.permission_id = data.permission_id
            obj.created_at = data.created_at
            obj.id = id
            let params = {
                TableName: "Users",
                Item: obj
            };

            DB.put(params, function (err) {
                if (callback)
                    callback(err)
            });
        }
    })
}

function deleteUser(id, DB, callback) {
    const params = {
        TableName: "Users",
        Key: {
            "id": id,
        },
    };

    DB.delete(params, function (err) {
        if (callback)
            callback(err)
    });
}

module.exports = {
    getAllUser,
    getUserById,
    getUserByEmail,
    getUserByDiscordID,
    createUser,
    updateUser,
    deleteUser
}
