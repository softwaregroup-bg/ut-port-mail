# **Mail port:** `ut-port-mail` #
The purpose of this port is for sending mails from remote/local servers.

### **Technological Dependencies** ###

 - `nodemailer` - [GitHub Official Page](https://github.com/andris9/Nodemailer)
 - `ut-bus/port` - TODO add link to documentation
 - `through2` - [GitHub Official Page](https://github.com/rvagg/through2)
 - `lodash` - [Official Page](https://lodash.com/)

In the UT5 implementations the Mail port is initialized in the following manner:

```javascript
    module.exports = {
        id: 'mail',
        type: 'mail',
        logLevel: 'trace',
        url: 'smtp://127.0.0.1:1234',
        service: false,
        settings: {},//setting that came from node mailer module, they are directly applied
        ssl: false,
        receive: function(msg) {
            return msg;
        },
        send: function(msg) {
            return msg;
        }
    }
```

all of the properties that can be set can be seen in the Nodemailer github page.

#### **Gmail example** ####

```javascript
module.exports = {
    id: 'mail',
    type: 'mail',
    logLevel: 'trace',
    url: 'smtp://smtp.gmail.com',
    service: 'gmail',
    settings: {
        auth: {
            user: 'user',
            pass: 'pass'
        }
    },//setting that came from node mailer module, they are directly applied
    ssl: false,
    receive: function(msg) {
        return msg;
    },
    send: function(msg) {
        return msg;
    }
}
```
 
