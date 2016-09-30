/* global sails, Feedback, FeedbackService, UserDetailService*/

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
    createFeedback(req, res) {
        let feedback = req.allParams();
        feedback.rating = feedback.rating ? parseInt(feedback.rating, 10) : undefined;

        if (!feedback.request || !feedback.message ||
            (typeof feedback.rating !== 'undefined' && (feedback.rating < 1 || feedback.rating > 5))) {

            return res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        feedback.author = req.session.user.id;

        FeedbackService.createFeedback(feedback)
            .then(
                (createdFeedback) => {
                    res.created(
                        {
                            feedback: createdFeedback
                        });

                    return createdFeedback;
                }
            )
            .then(
                (feedback)=> {
                    let executor = feedback.executor;

                    return UserDetailService.updateRating({id: executor});
                }
            )
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    return res.badRequest(
                        {
                            message: req.__('Request is not completed.')
                        }
                    );
                }
            );
    }
};

module.exports = FeedbackController;

