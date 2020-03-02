const nodemailer = require('nodemailer');
const Joi = require('joi');
const validations = require('./validation');

const serviceMapper = {
    gmail: 'Gmail'
};

/**
 * Validates constructor params
 * Returns Joi object with error object if any
 *
 * @param {Object} params
 * @param {Object} schema
 * @returns {Object}
 */
function validateParamsAgainstSchema(params, schema) {
    const result = Joi.validate(params, schema);
    return result;
}

/**
 * Constructor method expects valid params object
 *
 * @param {Object} params
 */
function MailClient(params, errors, logger, debug) {
    this.errors = errors;
    const validParams = validateParamsAgainstSchema(params, validations.validationConstructorClientSchema);
    if (!validParams.error) {
        const port = params.port || 465;
        this.transportParams = {
            port,
            secure: port === 465,
            logger,
            debug,
            ...params,
            service: serviceMapper[params.service] || params.service
        };
        this.transporter = nodemailer.createTransport(this.transportParams);
    } else {
        throw errors['portMail.invalidConfiguration'](validParams.error);
    }
}

/**
 * Send email
 *
 * @return {Object} promise
 */
MailClient.prototype.send = function(mailOptions) {
    return new Promise((resolve, reject) => {
        const validMailOptions = validateParamsAgainstSchema(mailOptions, validations.validateMailOptionsSchema);
        if (!validMailOptions.error) {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(handleError.call(this, error));
                } else {
                    resolve({
                        messageId: info.messageId,
                        response: info.response
                    });
                }
            });
        } else {
            reject(this.errors['portMail.invalidEmail'](validMailOptions.error));
        }
    });
};

/**
 * Handle Mail errors
 *
 * @param {Object} error
 * @returns {Object}
 */
function handleError(error) {
    if (error.code === 'EAUTH') {
        return this.errors['portMail.invalidCredentials'](error);
    } else {
        return this.errors.portMail(error);
    }
}

module.exports = MailClient;
