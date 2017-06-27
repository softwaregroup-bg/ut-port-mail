class MailClientHelpers {
    parseMailClientCreateParams(msg) {
        return {
            service: msg.service,
            host: msg.host || msg.url,
            port: msg.port,
            secure: msg.secure,
            auth: {
                user: msg.username || msg.auth.user,
                pass: msg.password || msg.auth.pass
            }
        };
    }
};

module.exports = {
    MailClientHelpers
};
