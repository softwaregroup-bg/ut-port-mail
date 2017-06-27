const MailClient = require('../client');
const { MailClientHelpers } = require('./helpers');

var mailClientHelpers;

module.exports = {
    init: function(b) {
        mailClientHelpers = new MailClientHelpers();
    },
    'testConnection': function(msg, $meta) {
        var mailClient = new MailClient(mailClientHelpers.parseMailClientCreateParams(msg));
        return mailClient.testConnection()
            .then((emailResponse) => {
                return { success: true };
            })
            .catch(function(error) {
                throw error;
            });
    },
    'send': function(msg, $meta) {
        var mailClient = new MailClient(mailClientHelpers.parseMailClientCreateParams(msg));
        var mailOptions = {
            from: msg.from,
            to: msg.to,
            subject: msg.subject,
            text: msg.text,
            html: msg.html
        };
        return mailClient.send(mailOptions)
            .then((emailSendResponse) => {
                return emailSendResponse;
            })
            .catch(function(error) {
                throw error;
            });
    }
};
