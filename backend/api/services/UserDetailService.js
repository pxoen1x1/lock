/* global UserDetail, FeedbackService */

'use strict';

let UserDetailService = {
    getUserDetailByUser(user) {

        return UserDetail.findOneByUser(user.id)
            .populate('licenses')
            .populate('serviceTypes')
            .populate('languages')
            .populate('workingHours')
            .then(
                (foundUserDetail) => {

                    return foundUserDetail;
                }
            );
    },
    updateRating(executor) {

        return FeedbackService.getAverageRating(executor)
            .then(
                (rating) => {
                    return UserDetail.update({user: executor.id}, {rating: rating})
                        .then(
                            (updatedUserDetails) => updatedUserDetails[0]
                        );
                }
            );
    },
    updateLocation(user, userDetail) {

        return UserDetail.update({user: user.id}, userDetail)
            .then(
                (updatedUserDetails) => {
                    if (updatedUserDetails.length === 0) {
                        let error = new Error('User is not specialist.');

                        return Promise.reject(error);
                    }

                    let location = {
                        latitude: updatedUserDetails[0].latitude,
                        longitude: updatedUserDetails[0].longitude
                    };

                    return location;
                }
            );
    }
};

module.exports = UserDetailService;
