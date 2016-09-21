/**
 * Feedback.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Feedback = {
    tableName: 'feedbacks',

    attributes: {
        message: {
            type: 'string',
        },
        rating: {
            type: 'integer',
            min: 1,
            max: 5
        },

        author: {
            model: 'User',
            required: true,
            columnName: 'author_id'
        },
        executor: {
            model: 'User',
            required: true,
            columnName: 'executor_id'
        },
        request: {
            model: 'Request',
            required: true,
            columnName: 'request_id'
        }
    }
};

module.exports = Feedback;

