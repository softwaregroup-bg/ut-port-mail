var url = require('url');
var Port = require('ut-bus/port');
var util = require('util');
var nodemailer = require('nodemailer');
var tv4 = require('tv4');
var errors = require('./errors');
var when = require('when');
var validation = require('./validation');

tv4.addFormat(require('tv4-formats'));

function Mail() {
    Port.call(this);
    this.transportOpts = {};
    this.protocol = false;
    this.transport = false;

    this.config = {
        id: 'mail',
        type: 'mail',
        logLevel: 'trace',
        url: 'smtp://127.0.0.1:1234',
        service: false,
        settings: {},
        ssl: false
    };
}

util.inherits(Mail, Port);

Mail.prototype.init = function init() {
    Port.prototype.init.apply(this, arguments);
    this.latency = this.counter && this.counter('average', 'lt', 'Latency');
    this.transportOpts = this.config.settings;

    if (!this.config.service) { // if there is no service set explicitly
        var parsedUrl = url.parse(this.config.url);
        this.transportOpts.host = parsedUrl.hostname;
        this.transportOpts.port = parsedUrl.port;
        // sets the protocol, based on url-proto, for instance smtp://127.0.0.1:3456 will set protocol smtp with destination host 127.0.0.1 on port 3456
        switch (parsedUrl.protocol.slice(0, -1)) {
            case 'direct':
                this.protocol = require('nodemailer-direct-transport');
                break;
            default:
                this.protocol = require('nodemailer-smtp-transport');
                break;
        }
    } else { // service config is set
        this.transportOpts.service = this.config.service;
    }
};

Mail.prototype.start = function start(callback) {
    // bindings
    Port.prototype.start.apply(this, arguments);
    if (this.protocol) { // crate transport based on protocol
        this.transport = nodemailer.createTransport(this.protocol(this.transportOpts));
    } else { // crate transport based on service
        this.transport = nodemailer.createTransport(this.transportOpts);
    }
    this.pipeExec(this.exec.bind(this), this.config.concurrency);
};

Mail.prototype.exec = function(msg) {
    return when.promise(function(resolve, reject) {
        if (tv4.validate(msg, validation.outgoingMail, true, true)) {
            // console.log(this.transportOpts);
            this.transport.sendMail(msg, function(err, responseStatus) {
                if (err) {
                    reject(errors.mail(err));
                } else {
                    resolve(responseStatus);
                }
            });
        } else {
            reject(errors.validation(tv4.error));
        }
    }.bind(this));
};

module.exports = Mail;
