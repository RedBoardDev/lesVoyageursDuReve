let { v1: uuidv1 } = require("uuid")

function getCommentById(id, DB, callback) {
    const params = {
        TableName: "Comments",
        Key: {
            "id": id
        }
    };

    DB.get(params, function (err, data) {
        if (callback) {
            if (data)
                callback(err, data.Item)
            else
                callback(err, undefined)
        }
    });
}


function getCommentByEventId(EventId, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": EventId
        },
        FilterExpression: "event_id = :a",
        TableName: "Comments"
    };

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

function createComment(obj, DB, callback) {
    if (!obj.event_id)
        obj["event_id"] = "0"
    if (!obj.user_id)
        obj["user_id"] = "0"
    if (!obj.message)
        obj["message"] = "0"
    obj.id = uuidv1()
    obj.created_at = new Date().getTime().toString()

    const params = {
        TableName: "Comments",
        Item: obj
    };

    DB.put(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateComment(id, obj, DB, callback) {

    getCommentById(id, DB, (err, data) => {
        if (err)
            callback(err)
        else {
            if (!obj.event_id)
                obj.event_id = data.event_id
            if (!obj.user_id)
                obj.event_id = data.event_id
            if (!obj.message)
                obj.event_id = data.event_id
            obj.id = data.id
            obj.created_at = data.created_at

            let params = {
                TableName: "Comments",
                Item: obj
            };

            DB.put(params, function (err) {
                if (callback)
                    callback(err)
            });
        }
    })
}

function deleteComment(id, DB, callback) {
    const params = {
        TableName: "Comments",
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
    getCommentById,
    getCommentByEventId,
    createComment,
    updateComment,
    deleteComment
}
