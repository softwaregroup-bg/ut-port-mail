const nodemailer = require('nodemailer');
const validations = require('./validation');

const serviceMapper = {
    gmail: 'Gmail'
};

function MailClient(params, errors, logger, debug, joi) {
    this.errors = errors;
    this.schema = validations(joi);
    const validParams = this.schema.client.validate(params);
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

MailClient.prototype.send = function(mailOptions) {
    return new Promise((resolve, reject) => {
        const validMailOptions = this.schema.mail.validate(mailOptions);
        if (!validMailOptions.error) {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(this.errors[error.code === 'EAUTH' ? 'portMail.invalidCredentials' : 'portMail'](error));
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

module.exports = MailClient;
