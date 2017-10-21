const merge = require('lodash.merge');
const util = require('util');
const MailClient = require('./client');

module.exports = function({parent}) {
    function MailPort({config}) {
        parent && parent.apply(this, arguments);
        this.config = merge({
            id: null,
            type: 'mail',
            logLevel: 'info',
            service: false,
            settings: {},
            ssl: false
        }, config);
    }

    if (parent) {
        util.inherits(MailPort, parent);
    }

    MailPort.prototype.init = function init() {
        parent && parent.prototype.init.apply(this, arguments);
    };

    MailPort.prototype.start = function start(callback) {
        parent && parent.prototype.start.apply(this, arguments);
        this.pull(this.exec);
    };

    MailPort.prototype.exec = function({service, host, url, port, secure, username, auth, password, from, to, subject, text, html, cc, bcc, replyTo, headers}) {
        let mailClient = new MailClient({
            service,
            host: host || url,
            port,
            secure,
            auth: {
                user: username || auth ? auth.user : null,
                pass: password || auth ? auth.pass : null
            }
        });
        return mailClient.send({
            from,
            to,
            subject,
            text,
            html: html || text,
            cc,
            bcc,
            replyTo,
            headers
        })
        .catch(error => {
            throw error;
        });
    };

    return MailPort;
};
