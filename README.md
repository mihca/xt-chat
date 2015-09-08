Dies ist ein einfacher, auf Node.js basierender Beispiel-Chat.

Die Codebasis stammt von:
http://nodecode.de/chat-nodejs-websocket

#Voraussetzung für Deployment auf CloudFoundry

1. package.json muss vorhanden sein

2. Environment
Port aus Environment lesen: `app.listen(process.env.VCAP_APP_PORT || 3000);`
oder
https://www.npmjs.com/package/cfenv

3. Push
```
cf push xt-chat -b https://github.com/cloudfoundry/nodejs-buildpack -c "node server.js"
```
oder
cf push mit manifest.yml:
```
---
applications:
- name: xt-chat
  memory: 256M
  host: xt-chat
  domain: cfapps.io
  command: node server.js
  buildpack: https://github.com/cloudfoundry/nodejs-buildpack
```

#Services anbinden

Die Anbindung erfolgt Service-spezifisch mit dem Auslesen der Service-Konfiguration aus dem Environment. `appEnv.getService("MongoChatDB")` liefert:

```
{
  "name":"MongoChatDB",
  "label":"mongolab",
  "tags":["Data Store","document","mongodb"],
  "plan":"sandbox",
  "credentials":{
    "uri":"mongodb://CloudFoundry_fkq80msb_pnts21qe_1e4tkslk:Uj2kdkHYHDTYo3P6m3QE6W61iEk6PKsl@ds035683.mongolab.com:35683/CloudFoundry_fkq80msb_pnts21qe"
  }
}
```

Beispiel-Code für die Anbindung:

```
// MONGODB
// Default-Wert für lokal
var mongoDBUrl = 'mongodb://localhost:27017/MongoChatDB';
var mongoDBServiceConfig = appEnv.getService("MongoChatDB");
if (mongoDBServiceConfig) {
    mongoDBUrl = mongoDBServiceConfig.credentials.uri;
}
MongoClient.connect(mongoDBUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to MongoDB server at " + mongoDBUrl);
    db.close();
});
```

