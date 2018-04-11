const merge = require('lodash.merge');
const util = require('util');
const MailClient = require('./client');
let errors;

module.exports = function({parent}) {
    function MailPort({config}) {
        parent && parent.apply(this, arguments);
        this.config = merge({
            id: null,
            type: 'mail',
            logLevel: 'info'
        }, config);
        errors = errors || require('./errors')(this.defineError);
    }

    if (parent) {
        util.inherits(MailPort, parent);
    }

    MailPort.prototype.start = function start(callback) {
        parent && parent.prototype.start.apply(this, arguments);
        this.pull(this.exec);
    };

    MailPort.prototype.exec = function(msg = {service, host, url, port, secure, username, password, from, to, subject, text, html, cc, bcc, replyTo, headers}) {
        let configParams = {
            service: this.config.service,
            host: this.config.host,
            url: this.config.url,
            port: this.config.port,
            secure: this.config.secure,
            username: this.config.username,
            password: this.config.password
        };
        let params = Object.assign({}, configParams, msg);

        return new MailClient({
            service: params.service,
            host: params.host,
            url: params.url,
            port: params.port,
            secure: params.secure,
            auth: {
                user: params.username,
                pass: params.password
            }
        }, errors).send({
            from: params.from,
            to: params.to,
            subject: params.subject,
            text: params.text,
            html: params.html || params.text,
            cc: params.cc,
            bcc: params.bcc,
            replyTo: params.replyTo,
            headers: params.headers
        });
    };

    return MailPort;
};
