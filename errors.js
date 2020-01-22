module.exports = ({defineError, getError, fetchErrors}) => {
    if (!getError('portMail')) {
        const PortMail = defineError('portMail', undefined, 'Mail sending error');

        defineError('validation', PortMail, 'Mail validation error');
        defineError('invalidConfiguration', PortMail, 'Invalid configuration');
        defineError('invalidCredentials', PortMail, 'Invalid credentials');
        defineError('client', PortMail, 'Email client error');
        defineError('invalidEmail', PortMail, 'Invalid email properties');
    }

    return fetchErrors('portMail');
};
