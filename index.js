var url = require('url');
var Port = require('ut-bus/port');
var util = require('util');
var _ = require('lodash');
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
function responseError(err, callback) {
    return callback({'$$':{'mtid':'error', 'errorCode':'MAIL:' + err.code, 'errorMessage': err.message || ''}});
}

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
    this.transportOpts = this.config.settings;

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
};

Mail.prototype.start = function start(callback) {
    //bindings
    Port.prototype.start.apply(this, arguments);
    this.pipeExec(this.exec.bind(this), this.config.concurrency);
    if (this.protocol) {//crate transport based on protocol
        this.transport = nodemailer.createTransport(this.protocol(this.transportOpts));
    } else {//crate transport based on service
        this.transport = nodemailer.createTransport(this.transportOpts);
    }
};

Mail.prototype.exec = function(msg, callback) {
    var mailArgs = _.clone(msg);
    delete mailArgs.$$;

    if (tv4.validate(mailArgs, mailArgsSchema, true, true)) {//incoming message gets validated
        console.log(this.transportOpts);
        this.transport.sendMail(mailArgs, function(err, responseStatus) {
            if (err) {
                responseError({code:'MailSend:' + err.code, message: err.message}, callback);
            } else {
                responseStatus.$$ = {mtid: 'response', opcode: msg && msg.$$ && msg.$$.opcode};
                callback(null, responseStatus);
            }
        });
    } else {//incoming message is rejected
        responseError({code:'InputValidation:' + tv4.error.code, message: [tv4.error.message, 'data path: ' + tv4.error.dataPath].join(';')}, callback);
    }
}

module.exports = Mail;
