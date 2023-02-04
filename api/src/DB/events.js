let { v1: uuidv1 } = require("uuid")

function getAllEvent(DB, callback) {
    const params = {
        TableName: "Events"
    };

    DB.scan(params, function (err, data) {
        if (callback) {
            if (data && data.Count >= 1)
                callback(err, data.Items)
            else
                callback(err, undefined)
        }
    });
}

function getEventById(queryAttributes, id, DB, callback) {
    const params = {
        TableName: "Events",
        Key: {
            id: id,
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

function getEventsFrom(queryAttributes, from, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": from
        },
        FilterExpression: "date_start >= :a",
        TableName: "Events"
    };

    if (!(queryAttributes && queryAttributes.length === 1 && queryAttributes[0] === "*"))
        params.ProjectionExpression = queryAttributes.join(", ");

    DB.scan(params, function (err, data) {
        if (callback) {
            callback(err, data.Items)
        }
    })
}

function createEvent(obj, DB, callback) {
    if (!obj.title)
        obj["title"] = "0"
    if (!obj.description)
        obj["description"] = "0"
    if (!obj.place_id)
        obj["place_id"] = "0"
    if (!obj.place_custom)
        obj["place_custom"] = "0"
    if (!obj.tags)
        obj["tags"] = "[]";
    if (!obj.admin_user_id)
        obj["admin_user_id"] = "0"
    if (!obj.user_registered_array)
        obj["user_registered_array"] = "[]"
    if (!obj.register_max)
        obj["register_max"] = "0"
    if (!obj.date_start)
        obj["date_start"] = "0"
    if (!obj.date_end)
        obj["date_end"] = "0"

    obj.id = uuidv1();
    obj.created_at = new Date().getTime().toString();

    const params = {
        TableName: "Events",
        Item: obj
    };

    DB.put(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateEvent(id, obj, DB, callback) {
    getEventById(["*"], id, DB, (err, data) => {
        if (err)
            callback(err)
        else {
            if (!obj.title)
                obj.title = data.title
            if (!obj.description)
                obj.description = data.description
            if (!obj.place_id)
                obj.place_id = data.place_id
            if (!obj.place_custom)
                obj.place_custom = data.place_custom
            if (!obj.tags)
                obj.tags = data.tags
            if (!obj.admin_user_id)
                obj.admin_user_id = data.admin_user_id
            if (!obj.user_registered_array)
                obj.user_registered_array = data.user_registered_array
            if (!obj.register_max)
                obj.register_max = data.register_max
            if (!obj.date_start)
                obj.date_start = data.date_start
            if (!obj.date_end)
                obj.date_end = data.date_end
            obj.created_at = data.created_at
            obj.id = data.id

            let params = {
                TableName: "Events",
                Item: obj
            };

            DB.put(params, function (err) {
                if (callback)
                    callback(err)
            });
        }
    })
}

function deleteEvent(id, DB, callback) {
    const params = {
        TableName: "Events",
        Key: {
            "id": id ,
        },
    };

    DB.delete(params, function (err) {
        if (callback)
            callback(err)
    });
}

module.exports = {
    getAllEvent,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsFrom
}
