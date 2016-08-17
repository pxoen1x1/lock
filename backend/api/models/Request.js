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
            type: 'datetime'
        },
        latitude: {
            type: 'float',
            required: true,
            is: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]*)?))$/
        },
        longitude: {
            type: 'float',
            required: true,
            is: /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/
        },
        distance: {
            type: 'integer'
        },
        isPublic: {
            type: 'boolean',
            default: false,
            columnName: 'is_public'
        },
        description: {
            type: 'string'
        },
        confirmedByCustomer: {
            type: 'boolean',
            columnName: 'confirmed_by_customer'
        },
        confirmedBySpecialist: {
            type: 'boolean',
            columnName: 'confirmed_by_specialist'
        },
        executed: {
            type: 'boolean'
        },
        cost: {
            type: 'float',
            is: /^\d+(\.\d{1,2})$/
        },
        closed: {
            type: 'boolean'
        },
        status: {
            type: 'integer'
        },

        language: {
            model: 'Language',
            columnName: 'language_id'
        },
        service: {
            model: 'Service',
            columnName: 'service_id',
        },
        creator: {
            model: 'User',
            required: true,
            columnName: 'creator_id'
        },
        executor: {
            model: 'User',
            columnName: 'executor_id'
        }
    },

    beforeCreate (request, next) {
        request.status = STATUSES.NEW;

        next(null, request);
    },

    beforeUpdate(request, next) {
        if (request.closed) {
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

