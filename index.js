var url = require('url');
var Port = require('ut-bus/port');
var util = require('util');
var _ = require('lodash');
var when = require('when');
var nodemailer = require('nodemailer');
var tv4 = require('tv4');

tv4.addFormat(require('tv4-formats'));
var mailArgsSchema = {
    title: 'Mail input fields validation',
    type: 'object',
    properties: {
        from: {
            type: 'string',
            format: 'email'
        },
        to: {
            type: 'string',
            format: 'email'
        },
        bcc: {
            type: 'string',
            format: 'email'
        },
        cc: {
            type: 'string',
            format: 'email'
        },
        replyTo: {
            type: 'string',
            format: 'email'
        },
        subject: {
            type: 'string',
            minLength: 3
        },
        text: {
            type: 'string',
            minLength: 10
        },
        html: {
            type: 'string',
            minLength: 10
        },
        headers: {
            type: 'array'
        },
        attachments: {
            type: 'array'
        },
        charset: {
            type: 'string'
        }
    },
    required: ['from', 'to', 'subject'],
    oneOf: [
        {required: ['text']},
        {required: ['html']},
    ]
};

function Mail() {
    Port.call(this);
    this.transportOpts = {};
    this.protocol = false;
    this.transport;

    this.config = {
        id: 'mail',
        type: 'mail',
        logLevel: 'trace',
        url: 'smtp://127.0.0.1:1234',
        service: false,
        auth: {},
        ssl: false
    };
}

util.inherits(Mail, Port);

Mail.prototype.init = function init() {
    Port.prototype.init.apply(this, arguments);
    if (!this.config.service) {
        var parsedUrl           = url.parse(this.config.url);
        this.transportOpts.host = parsedUrl.hostname;
        this.transportOpts.port = parsedUrl.port;
        switch (parsedUrl.protocol.slice(0, -1)) {
            case 'direct':
                this.protocol = require('nodemailer-direct-transport');
            break;
            default:
                this.protocol = require('nodemailer-smtp-transport');
            break;
        }
    } else {
        this.transportOpts.service = this.config.service;
    }
    this.transportOpts.secureConnection = this.config.ssl  || false;
    this.transportOpts.auth             = this.config.auth || {};
};

Mail.prototype.start = function start(callback) {
    Port.prototype.start.apply(this, arguments);
    this.pipeExec(this.exec.bind(this), this.config.concurrency);

    setTimeout(function(){
        this.exec({from: 'dessi.krasimirova@gmail.com', to: 'opensuser@gmail.com', subject: 'test mail', text: 'texttexttext'}, function (err, res){console.log(err || res);});
    }.bind(this), 1000);
};

Mail.prototype.exec = function(msg, callback) {
    when.promise(function(resolve, reject) {
        if (!this.transport) {
            //connect(e.g. create transport object)
            if (this.protocol) {
                this.transport = nodemailer.createTransport(this.protocol(this.transportOpts));
            } else {
                this.transport = nodemailer.createTransport(this.transportOpts);
            }
        }
        resolve();
    }.bind(this))
    .then(this.send.bind(this, msg))
    .then(function (res) {
        callback(null, res);
    })
    .catch(function(err) {
        return callback({'$$':{'mtid':'error', 'errorCode':'MAIL:' + err.code, 'errorMessage': err.message || ''}});
    });
}

Mail.prototype.send = function(msg) {
    return when.promise(function(resolve, reject) {
        var mailOptions = {};
        if (tv4.validate(msg, mailArgsSchema, true, true)) {
            console.log('--------------------');
            console.log(msg);
            console.log('--------------------');
            resolve(msg);
        } else {
            reject({code:'InputValidation:' + tv4.error.code, message: [tv4.error.message, 'data path: ' + tv4.error.dataPath].join(';')});
        }
    }.bind(this))
    .then(function(mailArgs) {
        return when.promise(function(res, rej) {
            this.transport.sendMail(mailArgs, function(err, responseStatus) {
                if (err) {
                    rej({code:'MailSend:' + err.code, message: err.message});
                } else {
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    console.log(responseStatus);
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                    res(responseStatus);
                }
            });
        }.bind(this))
    }.bind(this));
};

module.exports = Mail;
