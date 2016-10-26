'use strict';

let feedbackRoutes = {
    'GET /api/users/:user/feedbacks': {
        controller: 'FeedbackController',
        action: 'getUserFeedbacks'
    },
    'GET /api/client/requests/:requestId/feedback': {
        controller: 'FeedbackController',
        action: 'getRequestFeedback'
    },
    'POST /api/client/requests/:requestId/feedback': {
        controller: 'FeedbackController',
        action: 'createFeedback'
    }
};

module.exports.routes = feedbackRoutes;