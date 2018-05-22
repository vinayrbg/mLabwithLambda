/* 'use strict'
//var MongoClient = require('mongodb').MongoClient;
const config = require('./_config');
const mongoose = require('mongoose');
const Task = require('./models/task.model.js');
let conn = null;
const uri = 'mongodb://shrikar:16956@ds145892.mlab.com:45892/task_manager';

exports.handler = (event, context, callback) => {
    updateEventLoopIgnore();

    function updateEventLoopIgnore() {
        var ignoreEventLoop = process.env['IGNORE_EVENT_LOOP']
        if (ignoreEventLoop == "YES") {
            context.callbackWaitsForEmptyEventLoop = false;
        }
    }
    mongoose.connect(uri);
    mongoose.connection.on('error', (err) => {
        //if conenction fails
        console.log("\nhello");
        logger.error(err.message);
    });
    mongoose.connection.once('open', () => {
        logger.info("Connected to the DB at : " + config.mongoURI[app.settings.env]);
    });

    run().
    then(res => {
      callback(null, res);
      console.log('done');
    }).
    catch(error => callback(error));
};

function run() {
    return co(function*() {
      Task.find({})
        .then((allTasks) => {
            res.status(200).send(allTasks);
            return res;
        })
        .catch((err) => {
            res.status(404).send(err);
            return res;
        })
    });
  } */
'use strict'

var MongoClient = require('mongodb').MongoClient;

let cachedDb = null;
var connectionString = "mongodb://shrikar:16956@ds145892.mlab.com:45892/task_manager";

exports.handler = (event, context, callback) => {
    updateEventLoopIgnore();
    console.log("context",context.httpMethod);
    function updateEventLoopIgnore() {
        var ignoreEventLoop = process.env['IGNORE_EVENT_LOOP']
        if (ignoreEventLoop == "YES") {
            context.callbackWaitsForEmptyEventLoop = false;
        }
    }

    function connect(connectionString) {
        MongoClient.connect(connectionString, onConnectedCall);
    }

    function onConnectedCall(err, db) {
        if (err != null) {
            console.log(err);
            return;
        }
        onConnected(db)
    }

    function onConnected() {
        var cursor = filterFunction(db.collection("task_manager"));
        cursor.each(onProcessCursorItem);
    }

    function filterFunction() {
        return collection.find({});
    }

    function onProcessCursorItem() {

    }

    processEvent(event, context, callback);
};

function processEvent(event, context, callback) 
{
    console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
    var jsonContents = JSON.parse(JSON.stringify(event));

    //date conversion for grades array
    if (jsonContents.grades != null) {
        for (var i = 0, len = jsonContents.grades.length; i < len; i++) {
            jsonContents.grades[i].date = new Date();
        }
    }

    try {
        if (cachedDb == null) {
            console.log('=> connecting to database');
            MongoClient.connect(connectionString, function (err, client) {
                console.log("err", err);
                console.log("client", client);
                cachedDb = client.db("task_manager");
                return createDoc(cachedDb, jsonContents, callback);
            });
        }
        else {
            createDoc(cachedDb, jsonContents, callback);
        }
    }
    catch (err) {
        console.error('an error occurred', err);
    }
}

function createDoc(db, json, callback) {
    db.collection('tasks').find({}).toArray(function(err, result) {
        if (err) callback(null,err);
        console.log(result);
        callback(null,result);
      });
};