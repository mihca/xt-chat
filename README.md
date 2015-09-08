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


