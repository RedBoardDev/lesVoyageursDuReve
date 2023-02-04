const AWS = require("aws-sdk");

AWS.config.update({ region: 'global', endpoint: 'http://localhost:8000' });

const DynamoDB = new AWS.DynamoDB();

function createUsers() {
    const params = {
        TableName: "Users",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };
    DynamoDB.deleteTable({ TableName: "Users" }, function (err, data) {
        DynamoDB.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table", err);
            }
        });
    })
}

function createEvents(callback) {
    const params = {
        TableName: "Events",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };

    DynamoDB.deleteTable({ TableName: "Events" }, function (err, data) {
        DynamoDB.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table", err);
            } else {
                callback()
            }
        });
    })
}

function createComments() {
    const params = {
        TableName: "Comments",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };
    DynamoDB.deleteTable({ TableName: "Comments" }, function (err, data) {
        DynamoDB.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table", err);
            }
        });
    })
}

function createPlaces() {
    const params = {
        TableName: "Places",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };
    DynamoDB.deleteTable({ TableName: "Places" }, function (err, data) {
        DynamoDB.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table", err);
            }
        });
    })
}

function createTag() {
    const params = {
        TableName: "Tags",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10,
        },
    };
    DynamoDB.deleteTable({ TableName: "Tags" }, function (err, data) {
        DynamoDB.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table", err);
            }
        });
    })
}

const {createEvent} = require("../api/src/DB/events")

createUsers();
createEvents(() => {
});
createPlaces();
createComments();
createTag();


