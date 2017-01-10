/* global sails, UserDetailService, RequestService */

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
        let specialist = req.session.user;
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

        UserDetailService.updateLocation(specialist, userDetail)
            .then(
                (location) => {
                    res.ok(
                        {
                            location: location
                        }
                    );

                    let criteria = {
                        executor: specialist.id,
                        status: STATUS.IN_PROGRESS
                    };

                    return [location, RequestService.getRequests(criteria)];
                }
            )
            .spread(
                (location, requests) => {
                    if (requests.length === 0) {

                        return Promise.reject('Request is not found.');
                    }

                    let clientRooms = requests.map(
                        (request) => {
                            let ownerId = request.owner.id || request.owner;

                            return `user_${ownerId}`;
                        }
                    );

                    sails.sockets.broadcast(
                        clientRooms,
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

