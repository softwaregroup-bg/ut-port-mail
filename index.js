const merge = require('lodash.merge');
const util = require('util');
const MailClient = require('./client');

module.exports = function({parent}) {
    function MailPort({config}) {
        parent && parent.apply(this, arguments);
        this.config = merge({
            id: null,
            type: 'mail',
            logLevel: 'info'
        }, config);
    }

    if (parent) {
        util.inherits(MailPort, parent);
    }

    MailPort.prototype.start = function start(callback) {
        parent && parent.prototype.start.apply(this, arguments);
        this.pull(this.exec);
    };

    MailPort.prototype.exec = function({
        service = this.config.service,
        host = this.config.host,
        url = this.config.url,
        port = this.config.port,
        secure = this.config.secure,
        username = this.config.username,
        password = this.config.password,
        from, to, subject, text, html, cc, bcc, replyTo, headers
    }) {
        return new MailClient({
            service,
            host,
            url,
            port,
            secure,
            auth: {
                user: username,
                pass: password
            }
        }).send({
            from,
            to,
            subject,
            text,
            html: html || text,
            cc,
            bcc,
            replyTo,
            headers
        });
    };

    return MailPort;
};
