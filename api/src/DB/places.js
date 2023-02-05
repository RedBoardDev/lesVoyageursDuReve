let { v1: uuidv1 } = require("uuid")

function getAllPlace(DB, callback) {
    const params = {
        TableName: "Places"
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

function getPlaceById(id, DB, callback) {
    const params = {
        TableName: "Places",
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

function getPlaceByName(place_name, DB, callback) {
    var params = {
        ExpressionAttributeValues: {
            ":a": place_name
        },
        FilterExpression: "place_name = :a",
        TableName: "Places"
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

function createPlace(obj, DB, callback) {
    if (!obj.place_name)
        obj["place_name"] = "0"         //place_name et pas name parcque name etre reservé...¯\_(ツ)_/¯
    if (!obj.city)
        obj["city"] = "0"
    if (!obj.adresse)
        obj["adresse"] = "0"
    obj.id = uuidv1()
    obj.created_at = new Date().getTime().toString()


    const params = {
        TableName: "Places",
        Item: obj
    };

    DB.put(params, function (err) {
        if (callback)
            callback(err)
    });
}

function updatePlace(id, obj, DB, callback) {

    getPlaceById(id, DB, (err, data) => {
        if (err)
            callback(err)
        else {
            if (!obj.place_name)
                obj.place_name = data.place_name
            if (!obj.city)
                obj.city = data.city
            if (!obj.adresse)
                obj.adresse = data.adresse
            obj.created_at = data.created_at
            obj.id = id
            let params = {
                TableName: "Places",
                Item: {
                    id: { S: id }
                },
            };

            DB.put(params, function (err) {
                if (callback)
                    callback(err)
            });
        }
    })
}

function deletePlace(id, DB, callback) {
    const params = {
        TableName: "Places",
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
    getAllPlace,
    getPlaceById,
    getPlaceByName,
    createPlace,
    updatePlace,
    deletePlace
}
