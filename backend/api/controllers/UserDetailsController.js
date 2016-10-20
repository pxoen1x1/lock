/* global sails, UserDetail */

/**
 * UserDetailsController
 *
 * @description :: Server-side logic for managing Userdetails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

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
                (updatedUserDetails) => res.ok(
                    {
                        location: {
                            latitude: updatedUserDetails[0].latitude,
                            longitude: updatedUserDetails[0].longitude
                        }
                    }
                )
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

