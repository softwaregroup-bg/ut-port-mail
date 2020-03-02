require('ut-run').run({
    main: [
        () => ({
            test: () => [require('..')]
        }),
        require('ut-smtp-sim')()
    ],
    method: 'unit',
    config: {
        test: true,
        MailPort: {
            namespace: 'mail',
            host: 'localhost',
            maxConnections: 5,
            port: 8025
        },
        utSmtpSim: {
            orchestrator: true,
            adapter: true,
            smtp: {
                port: 8025,
                hook: 'smtpSim',
                server: {
                    disabledCommands: ['STARTTLS']
                }
            }
        }
    },
    params: {
        steps: [{
            method: 'mail.exec',
            name: 'Send email',
            params: {
                username: 'test',
                password: 'test',
                from: 'from@domain.com',
                to: 'to@domain.com',
                subject: 'subject',
                text: 'test',
                html: '<p>test</p>',
                cc: 'cc@domain.com',
                bcc: 'bcc@domain.coms',
                replyTo: 'no-reply@domain.com',
                attachments: [{
                    path: __filename
                }]
            },
            result: (result, assert) => {
                assert.equals(result.response, '250 OK: message queued');
            }
        }, {
            method: 'mail.exec',
            name: 'Missing credentials',
            params: {
                from: 'from@domain.com',
                to: 'to@domain.com',
                subject: 'subject'
            },
            error: (error, assert) => {
                assert.equals(error.type, 'portMail');
            }
        }, {
            method: 'mail.exec',
            name: 'Invalid credentials',
            params: {
                user: 'test',
                password: 'invalid',
                from: 'from@domain.com',
                to: 'to@domain.com',
                subject: 'subject'
            },
            error: (error, assert) => {
                assert.equals(error.type, 'portMail.invalidCredentials');
            }
        }, {
            method: 'mail.exec',
            name: 'Invalid email',
            params: {},
            error: (error, assert) => {
                assert.equals(error.type, 'portMail.invalidEmail');
            }
        }, {
            method: 'mail.exec',
            name: 'Invalid configuration',
            params: {
                host: 100
            },
            error: (error, assert) => {
                assert.equals(error.type, 'portMail.invalidConfiguration');
            }
        }]
    }
});
