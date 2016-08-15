/**
 * Request.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

module.exports = {
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
        closed: {
            type: 'boolean'
        },

        language: {
            model: 'Language',
            columnName: 'language_id'
        },
        services: {
            model: 'Service',
            columnName: 'service_id',
        }
    }
};

