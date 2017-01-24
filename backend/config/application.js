'use strict';

let application = {
    tokenLength: 16,
    queryLimit: 10,
    chat: {
        messagesLimit: 50,
        bidDefaultMessage: 'Please, start a chat with me.'
    },
    emailVerificationEnabled: true,
    tokenExpirationTime: 7*24*3600*1000,
    urls: {
        emailConfirmation: '/auth/email/confirm',
        passwordResetRequest: '/auth/password/reset',
        groupInvitation: '/group/members/invite'
    },
    mailer: {
        from: `LockHeal <no-reply@lockheal.com>`,
        providerPath: '/usr/sbin/sendmail',
        templates: {
            successRegistration: 'emails/successRegistration',
            confirmRegistration: 'emails/confirmRegistration',
            generatedPassword: 'emails/generatedPassword',
            passwordResetRequest: 'emails/passwordResetRequest',
            passwordResetConfirmation: 'emails/passwordResetConfirmation',
            groupInvitation: 'emails/groupInvitation'
        }
    }
};

module.exports.application = application;