const MailClient = require('./client');

module.exports = ({utPort, utError}) => class MailPort extends utPort {
    get defaults() {
        return {
            type: 'mail'
        };
    }
    start() {
        super.start(...arguments);
        this.pull(this.exec);
    }
    exec({
        service = this.config.service,
        host = this.config.host,
        url = this.config.url,
        port = this.config.port,
        secure = this.config.secure,
        username = this.config.username,
        password = this.config.password,
        from, to, subject, text, html, body, cc, bcc, replyTo, headers, attachments = []
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
        }, require('./errors')(utError)).send({
            from,
            to,
            subject,
            text,
            html: html || body || text,
            cc,
            bcc,
            replyTo,
            headers,
            attachments
        });
    }
};
