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
    from: Joi.string().required(),
    to: Joi.string().required(),
    subject: Joi.string().required(),
    text: Joi.string().required(),
    html: Joi.string().required()
});

module.exports = {
    validationConstructorClientSchema,
    validateMailOptionsSchema
};
