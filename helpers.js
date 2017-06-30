class MailClientHelpers {
    parseMailClientCreateParams(msg) {
        return {
            service: msg.service,
            host: msg.host || msg.url,
            port: msg.port,
            secure: msg.secure,
            auth: {
                user: msg.username || msg.auth ? msg.auth.user : null,
                pass: msg.password || msg.auth ? msg.auth.pass : null
            }
        };
    }

    parseMailOptionsParams(msg) {
        return {
            from: msg.from,
            to: msg.to,
            subject: msg.subject,
            text: msg.text,
            html: msg.html || msg.text,
            cc: msg.cc,
            bcc: msg.bcc,
            replyTo: msg.replyTo,
            headers: msg.headers
        };
    }
};

module.exports = {
    MailClientHelpers
};
