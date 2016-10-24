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

        return Request.findOneById(feedback.request.id)
            .then(
                (request) => {
                    feedback.executor = request.executor;

                    return Feedback.create(feedback);
                }
            );
    },
    getFeedbacksCount(criteria) {

        return Feedback.count(criteria)
            .then(
                (count) => count
            );
    }
};

module.exports = FeedbackService;
