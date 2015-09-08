var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    cfenv = require("cfenv"),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Environment auslesen
var appEnv = cfenv.getAppEnv();

// Webserver auf den Port x schalten
server.listen(appEnv.port, appEnv.bind, function() {
    console.log("Server starting on " + appEnv.url);
})

// MONGODB
var mongoDBServiceConfig = appEnv.getService("MongoChatDB");
var mongoDBUrl = 'mongodb://localhost:27017/MongoChatDB';
if (mongoDBServiceConfig) {
    mongoDBUrl = mongoDBServiceConfig.credentials.uri;
}
MongoClient.connect(mongoDBUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to MongoDB server at " + mongoDBUrl);
    db.close();
});

app.configure(function(){
	// statische Dateien ausliefern
	app.use(express.static(__dirname + '/public'));
});

// wenn der Pfad / aufgerufen wird
app.get('/', function (req, res) {
	// so wird die Datei index.html ausgegeben
	res.sendfile(__dirname + '/public/index.html');
});

// wenn der Pfad /clear aufgerufen wird
app.post('/clear', function (req, res) {
    // Chat löschen
    MongoClient.connect(mongoDBUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Clear chat");
        db.collection('chat').drop();
        db.close();
        res.status(200).send('OK');
    });
});

// Websocket
io.sockets.on('connection', function (socket) {

    // Konversation aus der DB lesen
    MongoClient.connect(mongoDBUrl, function(err, db) {
        assert.equal(null, err);
        db.collection('chat').find({}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length) {
                for (var i=0; i< result.length; i++)
                    socket.emit('chat', { zeit: result[i].zeit,  name: result[i].name, text: result[i].text });
            } else {
                console.log('No chat(s) found with defined "find" criteria!');
            }
            db.close();

            // der Client ist verbunden
            socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });
        });
    });

    // wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {

		// so wird dieser Text an alle anderen Benutzer gesendet
		io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });

        MongoClient.connect(mongoDBUrl, function(err, db) {
            assert.equal(null, err);
            var collection = db.collection('chat');
            collection.insertOne({zeit: new Date(), name: data.name || 'Anonym', text: data.text });
            db.close();
        });
	});
});
