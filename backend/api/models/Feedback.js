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
        text: {
            type: 'string',
            required: true
        },

        creator: {
            model: 'User',
            required: true,
            columnName: 'creator_id'
        },
        executor: {
            model: 'User',
            required: true,
            columnName: 'creator_id'
        },
        request: {
            model: 'Request',
            unique: true,
            required: true,
            columnName: 'request_id'
        }
    }
};

module.exports = Feedback;

