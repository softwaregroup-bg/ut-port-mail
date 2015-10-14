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
            type: 'array',
            minItems: 1,
            items: [
                {
                    type: 'object',
                    properties: {
                        filename: {
                            type: 'string',
                            minLength: 2
                        },
                        content: {
                            type: 'string',
                            minLength: 3
                        },
                        path: {
                            type: 'string',
                            minLength: 2
                        },
                        contentType: {
                            type: 'string',
                            minLength: 3
                        },
                        encoding: {
                            type: 'string',
                            minLength: 2
                        }
                    },
                    additionalProperties: false,
                    anyOf: [
                        {required: ['filename']},
                        {required: ['content']},
                        {required: ['path']},
                        {required: ['contentType']},
                        {required: ['encoding']}
                    ]
                }
            ]
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
    if (!this.config.service) {//settings does not hold service variable
        var parsedUrl           = url.parse(this.config.url);
        this.transportOpts.host = parsedUrl.hostname;
        this.transportOpts.port = parsedUrl.port;
        //sets the protocol based on protocol that is set in url, for instance smtp://127.0.0.1:3456 will set protocol smtm with dest host 127.0.0.1 on port 3456
        switch (parsedUrl.protocol.slice(0, -1)) {
            case 'direct':
                this.protocol = require('nodemailer-direct-transport');
            break;
            default:
                this.protocol = require('nodemailer-smtp-transport');
            break;
        }
    } else {//service config is set
        this.transportOpts.service = this.config.service;
    }
    this.transportOpts.secureConnection = this.config.ssl  || false;
    this.transportOpts.auth             = this.config.auth || {};
};

Mail.prototype.start = function start(callback) {
    //bindings
    Port.prototype.start.apply(this, arguments);
    this.pipeExec(this.exec.bind(this), this.config.concurrency);

    // setTimeout(function(){
    //     this.exec({from: 'dessi.krasimirova@gmail.com', to: 'opensuser@gmail.com', subject: 'test mail', text: 'texttexttext', attachments: [{path: '/home/zetxx/Desktop/kitykity.txt'}]}, function (err, res){console.log(err || res);});
    // }.bind(this), 1000);
};

Mail.prototype.exec = function(msg, callback) {
    when.promise(function(resolve, reject) {
        //connect(e.g. create transport object)
        if (!this.transport) {
            if (this.protocol) {//crate transport based on protocol
                this.transport = nodemailer.createTransport(this.protocol(this.transportOpts));
            } else {//crate transport based on service
                this.transport = nodemailer.createTransport(this.transportOpts);
            }
        }
        resolve();
    }.bind(this))
    .then(this.send.bind(this, msg))//sends a message
    .then(function (res) {//return the response to sender
        res.$$ = {mtid: 'response', opcode: msg && msg.$$ && msg.$$.opcode};
        callback(null, res);
    })
    .catch(function(err) {//trows a error and returns it to sender
        return callback({'$$':{'mtid':'error', 'errorCode':'MAIL:' + err.code, 'errorMessage': err.message || ''}});
    });
}

Mail.prototype.send = function(msg) {
    return when.promise(function(resolve, reject) {
        var mailArgs = _.clone(msg);
        delete mailArgs.$$;

        if (tv4.validate(mailArgs, mailArgsSchema, true, true)) {//incoming message gets validated
            resolve(mailArgs);
        } else {//incoming message is rejected
            reject({code:'InputValidation:' + tv4.error.code, message: [tv4.error.message, 'data path: ' + tv4.error.dataPath].join(';')});
        }
    }.bind(this))
    .then(function(mailArgs) {
        return when.promise(function(res, rej) {//try to send the message
            this.transport.sendMail(mailArgs, function(err, responseStatus) {
                if (err) {
                    rej({code:'MailSend:' + err.code, message: err.message});
                } else {
                    res(responseStatus);
                }
            });
        }.bind(this))
    }.bind(this));
};

module.exports = Mail;
