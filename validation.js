const Joi = require('joi');

/**
 * Joi validation schema used to validate constructor params object
 */
const validationConstructorClientSchema = Joi.object().keys({
    service: Joi.string().valid('gmail').required(),
    host: Joi.string().required(),
    port: Joi.number().integer().allow(null),
    secure: Joi.boolean().allow(null),
    auth: Joi.object().keys({
        user: Joi.string().required(),
        pass: Joi.string().required()
    }).required()
});

/**
 * Joi validation schema used to validate mailOptions object
 */
const validateMailOptionsSchema = Joi.object().keys({
    from: Joi.string().required().min(5),
    to: Joi.string().required().min(5),
    subject: Joi.string().required().min(3),
    text: Joi.string().required().min(10),
    html: Joi.string().min(10),
    cc: Joi.string().min(5),
    bcc: Joi.string().min(5),
    replyTo: Joi.string().min(5),
    headers: Joi.array().items(
        Joi.object().keys({
            key: Joi.string().required().min(2),
            value: Joi.string().required().min(3)
        })
    ),
    attachments: Joi.array().items(
        Joi.object().keys({
            filename: Joi.string().required().min(2),
            content: Joi.string().required().min(3),
            path: Joi.string().required().min(2),
            contentType: Joi.string().required().min(3),
            encoding: Joi.string().required.min(2)
        })
    )
});

module.exports = {
    validationConstructorClientSchema,
    validateMailOptionsSchema
};
