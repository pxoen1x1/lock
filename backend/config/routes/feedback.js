'use strict';

let feedbackRoutes = {
    'GET /api/users/:user/feedbacks': {
        controller: 'FeedbackController',
        action: 'getUserFeedbacks'
    },
    'POST /api/client/requests/:requestId/feedback': {
        controller: 'FeedbackController',
        action: 'createFeedback'
    }
};

module.exports.routes = feedbackRoutes;