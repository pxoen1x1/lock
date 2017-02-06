/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base device model
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let Device = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    tableName: 'devices',

    attributes: {
        token: {
            type: 'text',
            required: true
        },
        uuid: {
            type: 'string',
            required: true,
            unique: true
        },
        platform: {
            type: 'string',
            required: true
        },

        user: {
            model: 'User',
            columnName: 'user_id'
        },

        toJSON() {
            let device = this.toObject();

            delete device.id;
            delete device.user;

            return device;
        }
    },

    beforeValidate(device, next) {
        if (device.id) {

            delete device.id;
        }

        next();
    }
};

module.exports = Device;