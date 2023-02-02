let { v1: uuidv1 } = require("uuid")

function getPlaceById(id, DB, callback)
{
    const params = {
        TableName: "Places",
        Key: {
            id: { S: id },
        }
    };

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data)
    });
}

function createPlace(obj, DB, callback)
{
    if (!obj.name)
        obj["name"] = "0"
    if (!obj.city)
        obj["city"] = "0"
    if (!obj.adresse)
        obj["adresse"] = "0"

    const params = {
        TableName: "Places",
        Item: {
            id: { S: uuidv1() },
            name: { S: obj.name },
            city: { S: obj.city },
            adresse: { S: obj.adresse },
            created_at: { N: new Date().getTime().toString() }
        },
    };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updatePlace(id, obj, DB, callback)
{
    let params = {
        TableName: "Places",
        Item: {
            id: { S: id }
        },
    };

    if (obj.name)
        params.Item["name"] = { S: obj.name };
    if (obj.city)
        params.Item["city"] = { S: obj.city };
    if (obj.adresse)
        params.Item["adresse"] = { S: obj.adresse };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function deletePlace(id, DB, callback)
{
    const params = {
        TableName: "Places",
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
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
}
