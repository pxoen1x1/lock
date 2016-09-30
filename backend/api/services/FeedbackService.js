/* global Feedback, Request */
/**
 * Feedback Service
 */

'use strict';

let FeedbackService = {
    getAverageRating(executor) {

        return Feedback.findByExecutor(executor.id)
            .average('rating')
            .then(
                (averageRating) => {

                    return averageRating[0].rating.toFixed(1);
                }
            );
    },
    createFeedback(feedback) {

        return Request.findOneById(feedback.request)
            .then(
                (request) => {
                    if (!request.isExecuted || !request.executor) {

                        return Promise.reject();
                    }

                    feedback.executor = request.executor;

                    return Feedback.create(feedback);
                }
            );
    }
};

module.exports = FeedbackService;
