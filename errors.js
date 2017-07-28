var create = require('ut-error').define;

const PortMail = create('PortMail', undefined, 'Mail sending error');
const Validation = create('Validation', PortMail, 'Mail validation error');
const PortMailClient = create('PortMailClient', PortMail);

module.exports = {
    mail: cause => new PortMail(cause),
    validation: cause => new Validation(cause),
    badConstructorClientParams: create('badConstructorClientParams', PortMailClient, 'Bad client mail constructor params'),
    invalidCredentials: create('invalidCredentials', PortMailClient, 'Invalid credentials'),
    unknownError: (cause) => create('unknownError', PortMailClient, cause || 'Unknown error'),
    badMailOptionsParams: create('badMailOptionsParams', PortMailClient, 'Bad mail options params')
};
