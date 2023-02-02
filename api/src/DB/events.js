let { v1: uuidv1 } = require("uuid")

function getEventById(id, DB, callback)
{
    const params = {
        TableName: "Events",
        Key: {
            id: { S: id },
        }
    };

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data)
    });
}

function getEventsFrom(from, DB, callback)
{
    var params = {
        ExpressionAttributeValues: {
            ":a": {
                N: from
            }
        },
        FilterExpression: "date_start >= :a",
        TableName: "Events"
    };

    DB.scan(params, function (err, data) {
        if (callback) {
            callback(err, data.Items)
        }
    })
}

function createEvent(obj, DB, callback)
{
    if (!obj.title)
        obj["title"] = "0"
    if (!obj.description)
        obj["description"] = "0"
    if (!obj.place_id)
        obj["place_id"] = "0"
    if (!obj.place_custom)
        obj["place_custom"] = "0"
    if (!obj.game_id)
        obj["game_id"] = "0"
    if (!obj.game_custom)
        obj["game_custom"] = "0"
    if (!obj.game_type_id)
        obj["game_type_id"] = "0"
    if (!obj.game_type_custom)
        obj["game_type_custom"] = "0"
    if (!obj.admin_user_id)
        obj["admin_user_id"] = "0"
    if (!obj.user_registered_array)
        obj["user_registered_array"] = "0"
    if (!obj.register_max)
        obj["register_max"] = "0"
    if (!obj.date_start)
        obj["date_start"] = "0"
    if (!obj.date_end)
        obj["date_end"] = "0"

    const params = {
        TableName: "Events",
        Item: {
            id: { S: uuidv1() },
            title: { S: obj.title },
            description: { S: obj.description },
            place_id: { S: obj.place_id },
            place_custom: { S: obj.place_custom },
            game_id: { S: obj.game_id },
            game_custom: { S: obj.game_custom },
            game_type_id: { S: obj.game_type_id },
            game_type_custom: { S: obj.game_type_custom },
            admin_user_id: { S: obj.admin_user_id },
            user_registered_array: { S: obj.user_registered_array },
            register_max: { S: obj.register_max },
            date_start: { N: obj.date_start },
            date_end: { N: obj.date_end },
            created_at: { N: new Date().getTime().toString() },
        },
    };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateEvent(id, obj, DB, callback)
{
    let params = {
        TableName: "Events",
        Item: {
            id: { S: id }
        },
    };

    if (obj.title)
        params.Item["title"] = { S: obj.title };
    if (obj.description)
        params.Item["description"] = { S: obj.description };
    if (obj.place_id)
        params.Item["place_id"] = { S: obj.place_id };
    if (obj.place_custom)
        params.Item["place_custom"] = { S: obj.place_custom };
    if (obj.game_id)
        params.Item["game_id"] = { S: obj.game_id };
    if (obj.game_custom)
        params.Item["game_custom"] = { S: obj.game_custom };
    if (obj.game_type_id)
        params.Item["game_type_id"] = { S: obj.game_type_id };
    if (obj.game_type_custom)
        params.Item["game_type_custom"] = { S: obj.game_type_custom };
    if (obj.admin_user_id)
        params.Item["admin_user_id"] = { S: obj.admin_user_id };
    if (obj.user_registered_array)
        params.Item["user_registered_array"] = { S: obj.user_registered_array };
    if (obj.register_max)
        params.Item["register_max"] = { S: obj.register_max };
    if (obj.date_start)
        params.Item["date_start"] = { N: obj.date_start };
    if (obj.date_end)
        params.Item["date_end"] = { N: obj.date_end };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function deleteEvent(id, DB, callback)
{
    const params = {
        TableName: "Events",
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
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsFrom
}
