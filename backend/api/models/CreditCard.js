/**
 * CreditCard.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let CreditCard = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'credit_cards',

    attributes: {
        number: {
            type: 'number',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        expireDate: {
            type: 'string',
            required: true
        },
        cvv: {
            type: 'integer',
            required: true
        },

        customerProfileId: {
            model: 'CustomerProfile',
            columnName: 'customer_profile_id'
        }
    }
};

module.exports = CreditCard;

