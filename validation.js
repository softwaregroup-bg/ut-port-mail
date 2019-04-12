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
            content: Joi.string(),
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
