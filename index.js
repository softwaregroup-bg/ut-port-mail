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

    MailPort.prototype.exec = function({
        service = this.config.service,
        host = this.config.host,
        url = this.config.url,
        port = this.config.port,
        secure = this.config.secure,
        username = this.config.username,
        password = this.config.password,
        tls = this.config.tls,
        ignoreTLS = this.config.settings.ignoreTLS,
        requireTLS = this.config.settings.ignoreTLS,
        from, to, subject, text, html, cc, bcc, replyTo, headers
    }) {
        var auth = null;
        if (username && password) {
            auth = {
                user: username,
                pass: password
            };
        }
        return new MailClient({
            service,
            host,
            url,
            port,
            secure,
            auth,
            tls,
            ignoreTLS,
            requireTLS
        }, errors).send({
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
