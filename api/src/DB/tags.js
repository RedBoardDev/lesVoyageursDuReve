let { v1: uuidv1 } = require("uuid")

function getAllTag(DB, callback) {
    const params = {
        TableName: "Tags"
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

function getTagById(id, DB, callback) {
    const params = {
        TableName: "Tags",
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

function createTag(obj, DB, callback) {
    if (!obj.name)
        obj["name"] = "0"
    obj.id = uuidv1()
    obj.created_at = new Date().getTime().toString()

    const params = {
        TableName: "Tags",
        Item: obj
    };

    DB.put(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updateTag(id, obj, DB, callback) {
    getTagById(id, DB, (err, data) => {
        if (err)
            callback(err)
        else {
            if (!obj.name)
                obj.name = data.name
            obj.created_at = data.created_at
            obj.id = id
            let params = {
                TableName: "Tags",
                Item: obj
            };

            DB.put(params, function (err) {
                if (callback)
                    callback(err)
            });
        }
    })

}

function deleteTag(id, DB, callback) {
    const params = {
        TableName: "Tags",
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
    getAllTag,
    getTagById,
    createTag,
    updateTag,
    deleteTag
}
