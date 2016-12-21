/* global sails, GroupInvitation, Group */

/**
 * isGroupInvitationValid
 *
 * @module      :: Policy
 * @description :: Assumes that your token is valid and group exists;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let token = req.param('token');

    if (!token) {

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    let error = new Error();

    GroupInvitation.findOneByToken(token)
        .then(
            (invitation) => {
                if (!invitation) {
                    error.message = 'Token not found.';
                    error.isToSend = true;

                    return Promise.reject(error);
                }

                let now = new Date();

                if (invitation.expiration <= now) {
                    error.message = `Token is expired.`;
                    error.isToSend = true;

                    return Promise.reject(error);
                }

                return Group.findOneById(invitation.group);
            }
        )
        .then(
            (group) => {
                if (!group) {
                    error.message = `Group does not exist.`;
                    error.isToSend = true;

                    return Promise.reject(error);
                }

                next();
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                let message = err.isToSend ? {message: err.message} : null;

                return res.serverError(message);
            }
        );
};