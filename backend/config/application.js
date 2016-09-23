'use strict';

let application = {
    tokenLength: 16,
    queryLimit: 10,
    chat: {
        messagesLimit: 50,
        bidDefaultMessage: 'Please, add me to chat.'
    },
    emailVerificationEnabled: true,
    resetPasswordExpiresTime: 24*3600*1000,
    urls: {
        emailConfirmation: '/auth/email/confirm',
        passwordResetRequest: '/auth/password/reset'
    },
    mailer: {
        from: `LockSmith <no-reply@locksmith.local>`,
        providerPath: '/usr/sbin/sendmail',
        templates: {
            successRegistration: 'emails/successRegistration',
            confirmRegistration: 'emails/confirmRegistration',
            passwordResetRequest: 'emails/passwordResetRequest',
            passwordResetConfirmation: 'emails/passwordResetConfirmation'
        }
    }
};

module.exports.application = application;