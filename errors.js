const create = require('ut-error').define;
const PortMail = create('PortMail', undefined, 'Mail sending error');
const PortMailClient = create('PortMailClient', PortMail);

module.exports = {
    mail: cause => new PortMail(cause),
    validation: create('Validation', PortMail, 'Mail validation error'),
    badConstructorClientParams: create('badConstructorClientParams', PortMailClient, 'Bad client mail constructor params'),
    invalidCredentials: create('invalidCredentials', PortMailClient, 'Invalid credentials'),
    unknownError: create('unknownError', PortMailClient, 'Unknown error'),
    badMailOptionsParams: create('badMailOptionsParams', PortMailClient, 'Bad mail options params')
};
