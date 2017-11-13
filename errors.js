module.exports = create => {
    const PortMail = create('portMail', undefined, 'Mail sending error');
    const Client = create('client', PortMail);

    return {
        mail: cause => new PortMail(cause),
        validation: create('validation', PortMail, 'Mail validation error'),
        badConstructorClientParams: create('badConstructorClientParams', Client, 'Bad client mail constructor params'),
        invalidCredentials: create('invalidCredentials', Client, 'Invalid credentials'),
        clientError: create('error', Client, 'Email client error'),
        badMailOptionsParams: create('badMailOptionsParams', Client, 'Bad mail options params')
    };
};
