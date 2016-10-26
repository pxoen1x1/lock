/* global sails */

/**
 * Bid.js
 *
 * @module      :: Model
 * @description :: Holds service provider's bids
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

'use strict';

let Bid = {
    tableName: 'bids',

    attributes: {
        message: {
            type: 'string',
            defaultsTo() {

                return sails.__(sails.config.application.chat.bidDefaultMessage);
            }
        },
        cost: {
            type: 'float',
            is: /^\d*(\.\d{1,2})?$/
        },
        isRefused: {
            type: 'boolean',
            defaultsTo: false,
            columnName: 'is_refused'
        },

        client: {
            model: 'User',
            required: true,
            columnName: 'client_id'
        },
        specialist: {
            model: 'User',
            required: true,
            columnName: 'specialist_id'
        },
        request: {
            model: 'Request',
            required: true,
            columnName: 'request_id'
        }
    }
};

module.exports = Bid;

