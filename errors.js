var create = require('ut-error').define;

var PortMail = create('PortMail', undefined, 'Mail sending error');
var Validation = create('Validation', PortMail, 'Mail validation error');

module.exports = {
    mail: function(cause) {
        return new PortMail(cause);
    },
    validation: function(cause) {
        return new Validation(cause);
    }
};
