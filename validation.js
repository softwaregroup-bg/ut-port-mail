const Joi = require('joi');

/**
 * Joi validation schema used to validate constructor params object
 */
const validationConstructorClientSchema = Joi.object().keys({
    url: Joi.string().allow(null),
    service: Joi.string().valid('gmail').allow(null),
    host: Joi.string().allow(null),
    port: Joi.number().integer().allow(null),
    secure: Joi.boolean().allow(null),
    ignoreTLS: Joi.boolean().allow(null),
    requireTLS: Joi.boolean().allow(null),
    disableFileAccess: Joi.boolean().allow(null),
    disableUrlAccess: Joi.boolean().allow(null),
    tls: Joi.object().allow(null),
    authMethod: Joi.string().allow(null),
    name: Joi.string().allow(null),
    localAddress: Joi.string().allow(null),
    connectionTimeout: Joi.number().integer().allow(null),
    greetingTimeout: Joi.number().integer().allow(null),
    socketTimeout: Joi.number().integer().allow(null),
    pool: Joi.boolean().allow(null),
    maxConnections: Joi.number().integer().allow(null),
    maxMessages: Joi.number().integer().allow(null),
    rateDelta: Joi.number().integer().allow(null),
    rateLimit: Joi.number().integer().allow(null),
    proxy: Joi.string().allow(null),
    auth: Joi.object().keys({
        user: Joi.string().allow(null),
        pass: Joi.string().allow(null)
    }).allow(null)
});

/**
 * Joi validation schema used to validate mailOptions object
 */
const validateMailOptionsSchema = Joi.object().keys({
    from: Joi.string().required(),
    to: Joi.string().required(),
    subject: Joi.string().required(),
    text: Joi.string().allow(null),
    html: Joi.string().allow(null),
    cc: Joi.string().allow(null),
    bcc: Joi.string().allow(null),
    replyTo: Joi.string().allow(null),
    headers: Joi.array().items(
        Joi.object().keys({
            key: Joi.string().required(),
            value: Joi.string().required()
        })
    ).allow(null),
    attachments: Joi.array().items(
        Joi.object().keys({
            filename: Joi.string(),
            content: Joi.any(),
            path: Joi.string(),
            href: Joi.string(),
            contentType: Joi.string(),
            contentDisposition: Joi.string(),
            cid: Joi.string(),
            encoding: Joi.string(),
            headers: Joi.object(),
            raw: Joi.string()
        }).or('content', 'path', 'href', 'raw')
    ).allow(null)
});

module.exports = {
    validationConstructorClientSchema,
    validateMailOptionsSchema
};
