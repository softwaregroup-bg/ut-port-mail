var create = require('errno').custom.createError;

var PortMail = create('PortMail');
var Validation = create('Validation', PortMail);

module.exports = {
    mail: function(cause) {
        return new PortMail('Mail sending error', cause);
    },
    validation: function(cause) {
        return new Validation('Mail validation error', cause);
    }
};
