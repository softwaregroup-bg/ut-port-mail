const util = require('util');
const MailClient = require('./client');
module.exports = ({utPort, utError, joi, version}) => {
    if (!version || !version('10.38.1')) throw new Error('ut-port-mail requires ut-run >= 10.38.1');

    const additionalMailClientOptions = {};
    return class MailPort extends utPort {
        get defaults() {
            return {
                type: 'mail'
            };
        }

        get schema() {
            return {
                type: 'object',
                properties: {
                    service: {type: 'string'},
                    username: {type: 'string'},
                    password: {type: 'string'},
                    host: {type: 'string'},
                    port: {type: ['integer', 'null']},
                    secure: {type: 'boolean'},
                    ignoreTLS: {type: 'boolean'},
                    from: {type: 'string'}
                }
            };
        }

        get uiSchema() {
            return {
                password: {
                    'ui:emptyValue': '',
                    'ui:widget': 'password'
                },
                username: {
                    'ui:emptyValue': ''
                },
                host: {
                    'ui:emptyValue': ''
                },
                service: {
                    'ui:emptyValue': ''
                }
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
            from = this.config.from,
            to, subject, text, html, body, cc, bcc, replyTo, headers, attachments
        }) {
            const handler = level => {
                const log = this.log[level];
                const trace = this.log.trace;
                if (log) {
                    return ({name, ...data}, message, ...args) => {
                        const method = ['client', 'server', 'message'].includes(data.tnx) ? trace : log;
                        return method && method.call(this.log, message && util.format(message, ...args), name ? {label: name, ...data} : {...data});
                    };
                } else {
                    return () => false;
                }
            };

            const logger = {
                trace: handler('trace'),
                debug: handler('debug'),
                info: handler('info'),
                warn: handler('warn'),
                error: handler('error'),
                fatal: handler('fatal')
            };

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
            }, require('./errors')(utError), logger, !!logger.trace, joi).send({
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
