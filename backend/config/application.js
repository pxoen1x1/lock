'use strict';

let application = {
    tokenLength: 16,
    customerVerificationEnabled: true,
    mailer: {
        from: `LockSmith <no-reply@locksmith.local>`,
        providerPath: '/usr/sbin/sendmail',
        templates: {
            successRegistration: 'emails/successRegistration',
            confirmRegistration: 'emails/confirmRegistration'
        }
    }
};

module.exports.application = application;