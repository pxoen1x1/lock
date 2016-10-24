/* global sails, UserDetail, Request */

/**
 * UserDetailsController
 *
 * @description :: Server-side logic for managing Userdetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

const STATUS = sails.config.requests.STATUSES;

let UserDetailsController = {
    updateLocation(req, res){
        let specialist = req.session.user.id;
        let params = req.body;
        let location = params.location;

        if (!location.latitude || !location.longitude) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        let userDetail = {
            latitude: location.latitude,
            longitude: location.longitude
        };

        UserDetail.update({user: specialist}, userDetail)
            .then(
                (updatedUserDetails) => {
                    let location = {
                        latitude: updatedUserDetails[0].latitude,
                        longitude: updatedUserDetails[0].longitude
                    };

                    let criteria = {
                        executor: specialist,
                        status: STATUS.IN_PROGRESS
                    };

                    res.ok(
                        {
                            location: location
                        }
                    );

                    return [Request.findOne(criteria), location];
                }
            )
            .spread(
                (request, location) => {
                    if (!request) {

                        return;
                    }

                    let clientRoom = `user_${request.owner}`;

                    sails.sockets.broadcast(
                        clientRoom,
                        'location',
                        {
                            type: 'update',
                            location: location
                        },
                        req
                    );
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    }
};

module.exports = UserDetailsController;

