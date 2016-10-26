/* global sails */
/**
 * Request.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Request = {
    tableName: 'requests',

    attributes: {
        forDate: {
            type: 'datetime',
            columnName: 'for_date'
        },
        distance: {
            type: 'integer',
            defaultsTo: 100,
            max: 100
        },
        isPublic: {
            type: 'boolean',
            default: false,
            columnName: 'is_public'
        },
        description: {
            type: 'string'
        },
        cost: {
            type: 'float',
            is: /^\d*(\.\d{1,2})?$/
        },
        status: {
            type: 'integer'
        },
        language: {
            model: 'Language',
            columnName: 'language_id'
        },
        serviceType: {
            model: 'ServiceType',
            columnName: 'service_type_id',
        },
        location: {
            model: 'Location',
            unique: true,
            columnName: 'location_id'
        },
        owner: {
            model: 'User',
            required: true,
            columnName: 'owner_id'
        },
        executor: {
            model: 'User',
            columnName: 'executor_id'
        },

        feedbacks: {
            collection: 'Feedback',
            via: 'request'
        },
        chats: {
            collection: 'Chat',
            via: 'request'
        },
        bids: {
            collection: 'Bid',
            via: 'request'
        }
    }
};

module.exports = Request;

