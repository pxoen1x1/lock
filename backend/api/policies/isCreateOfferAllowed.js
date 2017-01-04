/* global sails, Group */

/**
 * isCreateOfferAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that you have permissions to assign the service provider to the offer;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';


module.exports = function (req, res, next) {
    let params = req.allParams();

    let chatId = req.params.chatId;
    let offer = params.offer;
    let executor = params.offer.executor;
    let user = req.session.user;

    if (!chatId || !offer || !offer.message || !offer.cost) {

        return res.badRequest(
            {
                message: req.__('Submitted data is invalid.')
            }
        );
    }

    if (!executor) {

        return next();
    }

    Group.findOneByAdmin(user.id)
        .populate('members')
        .then(
            (group) => {
                if (group) {
                    let isGroupMember = group.members.some(
                        (member) => member.id === executor.id
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
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                return res.serverError();
            }
        );
};