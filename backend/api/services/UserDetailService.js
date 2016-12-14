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
    }
};

module.exports = UserDetailService;
