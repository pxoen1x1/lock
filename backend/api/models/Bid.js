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
                sails.__(sails.config.application.chat.bidDefaultMessage);
            }
        },
        cost: {
            type: 'integer'
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

