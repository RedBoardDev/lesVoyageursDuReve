let { v1: uuidv1 } = require("uuid")

function getCommentById(id, DB, callback)
{
    const params = {
        TableName: "Comments",
        Key: {
            id: { S: id },
        }
    };

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data)
    });
}

function createComment(obj, DB, callback)
{
    if (!obj.event_id)
        obj["event_id"] = "0"
    if (!obj.user_id)
        obj["user_id"] = "0"
    if (!obj.message)
        obj["message"] = "0"

    const params = {
        TableName: "Comments",
        Item: {
            id: { S: uuidv1() },
            event_id: { S: obj.event_id },
            user_id: { S: obj.user_id },
            message: { S: obj.message },
            created_at: { N: new Date().getTime().toString() }
        },
    };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateComment(id, obj, DB, callback)
{
    let params = {
        TableName: "Comments",
        Item: {
            id: { S: id }
        },
    };

    if (obj.event_id)
        params.Item["event_id"] = { S: obj.event_id };
    if (obj.user_id)
        params.Item["user_id"] = { S: obj.user_id };
    if (obj.message)
        params.Item["message"] = { S: obj.message };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function deleteComment(id, DB, callback)
{
    const params = {
        TableName: "Comments",
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
    getCommentById,
    createComment,
    updateComment,
    deleteComment
}
