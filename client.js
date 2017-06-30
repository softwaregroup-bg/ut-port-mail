const nodemailer = require('nodemailer');
const Joi = require('joi');
var validations = require('./validation');
var errors = require('./errors');

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
    var result = Joi.validate(params, schema);
    return result;
}

/**
 * Constructor method expects valid params object
 *
 * @param {Object} params
 */
function MailClient(params) {
    var validParams = validateParamsAgainstSchema(params, validations.validationConstructorClientSchema);
    if (!validParams.error) {
        var port = this.port || 465;
        var secure = true;
        if (typeof params.secure === 'boolean') {
            secure = params.secure;
        } else {
            secure = port === 465;
        }
        this.transportParams = {
            service: serviceMapper[params.service],
            host: params.host,
            port: port,
            secure: secure,
            auth: params.auth
        };
        this.transporter = nodemailer.createTransport(this.transportParams);
    } else {
        throw errors.badConstructorClientParams(validParams.error.message);
    }
}

/**
 * Send email
 *
 * @return {Object} promise
 */
MailClient.prototype.send = function(mailOptions) {
    return new Promise((resolve, reject) => {
        var validMailOptions = validateParamsAgainstSchema(mailOptions, validations.validateMailOptionsSchema);
        if (!validMailOptions.error) {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(handleError(error));
                } else {
                    resolve({
                        messageId: info.messageId,
                        response: info.response
                    });
                }
            });
        } else {
            reject(errors.badMailOptionsParams(validMailOptions.error.message));
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
        return errors.invalidCredentials();
    } else {
        return error.unknownError();
    }
}

module.exports = MailClient;
