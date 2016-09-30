/**
 * FeedbackController
 *
 * @description :: Server-side logic for managing Feedbacks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let FeedbackController = {
    getUserFeedbacks(req, res) {
        let executor = req.params.user;

        if (!executor) {

            res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Feedback.findByExecutor(executor)
            .populateAll()
            .then(
                (feedbacks) => res.ok(
                    {
                        feedbacks: feedbacks
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    },
};

module.exports = FeedbackController;

