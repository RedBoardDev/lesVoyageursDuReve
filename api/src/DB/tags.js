let { v1: uuidv1 } = require("uuid")

function getTagById(id, DB, callback)
{
    const params = {
        TableName: "Tags",
        Key: {
            id: { S: id },
        }
    };

    DB.getItem(params, function (err, data) {
        if (callback)
            callback(err, data)
    });
}

function createTag(obj, DB, callback)
{
    if (!obj.name)
        obj["name"] = "0"

    const params = {
        TableName: "Tags",
        Item: {
            id: { S: uuidv1() },
            name: { S: obj.name },
            created_at: { N: new Date().getTime().toString() },
        },
    };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateTag(id, obj, DB, callback)
{
    let params = {
        TableName: "Tags",
        Item: {
            id: { S: id }
        },
    };

    if (obj.name)
        params.Item["name"] = { S: obj.name };

    DB.putItem(params, function (err) {
        if (callback)
            callback(err)
    });
}

function deleteTag(id, DB, callback)
{
    const params = {
        TableName: "Tags",
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
    getTagById,
    createTag,
    updateTag,
    deleteTag
}
