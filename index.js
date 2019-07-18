const MailClient = require('./client');
module.exports = ({utPort, utError}) => {
    const additionalMailClientOptions = {};
    return class MailPort extends utPort {
        get defaults() {
            return {
                type: 'mail'
            };
        }
        async start(...params) {
            const result = await super.start(...params);
            [
                'ignoreTLS',
                'requireTLS',
                'disableFileAccess',
                'disableUrlAccess',
                'tls',
                'authMethod',
                'name',
                'localAddress',
                'connectionTimeout',
                'greetingTimeout',
                'socketTimeout',
                'pool',
                'maxConnections',
                'maxMessages',
                'rateDelta',
                'rateLimit',
                'proxy'
            ].forEach(option => {
                const value = this.config[option];
                if (typeof value !== 'undefined') additionalMailClientOptions[option] = value;
            });
            this.pull(this.exec);
            return result;
        }
        exec({
            service = this.config.service,
            host = this.config.host,
            url = this.config.url,
            port = this.config.port,
            secure = this.config.secure,
            username = this.config.username,
            password = this.config.password,
            from, to, subject, text, html, body, cc, bcc, replyTo, headers, attachments
        }) {
            return new MailClient({
                service,
                host,
                url,
                port,
                secure,
                auth: (username || password) && {
                    user: username,
                    pass: password
                },
                ...additionalMailClientOptions
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
};
