/* global sails, Group */

/**
 * isGroupMember
 *
 * @module      :: Policy
 * @description :: Assumes that you have permission to get group member;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let memberId = parseInt(req.params.memberId, 10);
    let user = req.session.user;

    if (!memberId) {

        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Group.findOneByAdmin(user.id)
        .populate('members')
        .then(
            (group) => {
                if (group) {
                    let isGroupMember = group.members.some(
                        (member) => member.id === memberId
                    );

                    if (isGroupMember) {

                        return next();
                    }
                }

                sails.log.debug(new Error('You are not permitted to perform this action.'));

                return res.forbidden(
                    {
                        message: req.__('You are not permitted to perform this action.')
                    }
                );
            })
        .catch(
            (err) => {
                sails.log.error(err);

                return res.serverError();
            }
        );
};


