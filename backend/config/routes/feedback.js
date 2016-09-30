'use strict';

let feedbackRoutes = {
    'GET /api/users/:user/feedbacks': {
        controller: 'FeedbackController',
        action: 'getUserFeedbacks'
    }
};

module.exports.routes = feedbackRoutes;