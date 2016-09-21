/* global Feedback */
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
    }
};

module.exports = FeedbackService;
