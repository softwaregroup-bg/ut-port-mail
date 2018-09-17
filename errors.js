module.exports = ({defineError, getError, fetchErrors}) => {
    if (!getError('portMail')) {
        const PortMail = defineError('portMail', undefined, 'Mail sending error');
        const Client = defineError('client', PortMail, 'Mail client error');

        defineError('validation', PortMail, 'Mail validation error');
        defineError('badConstructorClientParams', Client, 'Bad client mail constructor params');
        defineError('invalidCredentials', Client, 'Invalid credentials');
        defineError('error', Client, 'Email client error');
        defineError('badMailOptionsParams', Client, 'Bad mail options params');
    }

    return fetchErrors('portMail');
};
