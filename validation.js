module.exports = joi => ({
    client: joi.object().keys({
        url: joi.string().allow(null),
        service: joi.string().valid('gmail').allow(null),
        host: joi.string().allow(null),
        port: joi.number().integer().allow(null),
        secure: joi.boolean().allow(null),
        ignoreTLS: joi.boolean().allow(null),
        requireTLS: joi.boolean().allow(null),
        disableFileAccess: joi.boolean().allow(null),
        disableUrlAccess: joi.boolean().allow(null),
        tls: joi.object().allow(null),
        authMethod: joi.string().allow(null),
        name: joi.string().allow(null),
        localAddress: joi.string().allow(null),
        connectionTimeout: joi.number().integer().allow(null),
        greetingTimeout: joi.number().integer().allow(null),
        socketTimeout: joi.number().integer().allow(null),
        pool: joi.boolean().allow(null),
        maxConnections: joi.number().integer().allow(null),
        maxMessages: joi.number().integer().allow(null),
        rateDelta: joi.number().integer().allow(null),
        rateLimit: joi.number().integer().allow(null),
        proxy: joi.string().allow(null),
        auth: joi.object().keys({
            user: joi.string().allow(null),
            pass: joi.string().allow(null)
        }).allow(null, false)
    }),
    mail: joi.object().keys({
        from: joi.string().required(),
        to: joi.string().required(),
        subject: joi.string().required(),
        text: joi.string().allow(null),
        html: joi.string().allow(null),
        cc: joi.string().allow(null),
        bcc: joi.string().allow(null),
        replyTo: joi.string().allow(null),
        headers: joi.array().items(
            joi.object().keys({
                key: joi.string().required(),
                value: joi.string().required()
            })
        ).allow(null),
        attachments: joi.array().items(
            joi.object().keys({
                filename: joi.string(),
                content: joi.string(),
                path: joi.string(),
                href: joi.string(),
                contentType: joi.string(),
                contentDisposition: joi.string(),
                cid: joi.string(),
                encoding: joi.string(),
                headers: joi.object(),
                raw: joi.string()
            }).or('content', 'path', 'href', 'raw')
        ).allow(null)
    })
});
