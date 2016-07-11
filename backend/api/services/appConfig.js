'use strict';

let appConfig = {
    customerVerificationEnabled: true,
    mailer: {
        from: `LockSmith <no-reply@locksmith.local>`,
        providerPath: '/usr/sbin/sendmail',
        templates: {
            successRegistration: 'emails/successRegistration',
            confirmRegistration: 'Please, confirm your registration'
        }
    }
};

module.exports = appConfig;