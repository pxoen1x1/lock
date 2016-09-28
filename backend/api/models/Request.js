/* global sails */
/**
 * Request.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

const STATUSES = sails.config.requests.STATUSES;

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
        isExecuted: {
            type: 'boolean',
            columnName: 'is_executed'
        },
        cost: {
            type: 'float',
            is: /^\d*(\.\d{1,2})?$/
        },
        isClosed: {
            type: 'boolean',
            columnName: 'is_closed'
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
        bids : {
            collection: 'Bid',
            via: 'request'
        }
    },

    beforeCreate (request, next) {
        request.status = STATUSES.NEW;

        next(null, request);
    },

    beforeUpdate(request, next) {
        if (request.isClosed) {
            request.status = STATUSES.CLOSED;

            return next(null, request);
        }

        if (request.executor) {
            request.status = STATUSES.IN_PROGRESS;

            return next(null, request);
        }
    }
};

module.exports = Request;

