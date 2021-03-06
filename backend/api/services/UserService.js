/* global User, UserDetailService, HelperService */

'use strict';

let promise = require('bluebird');

let UserService = {
    getUser(user) {
        return User.findOneById(user.id)
            .populate('address')
            .populate('auth')
            .populate('usingLanguage')
            .populate('groups')
            .populate('groupMembers')
            .then(
                (foundUser) => {

                    return UserDetailService.getUserDetailByUser(foundUser)
                        .then(
                            (userDetails) => {
                                foundUser.details = userDetails;

                                return foundUser;
                            }
                        );
                }
            );
    },
    findServiceProviders(params) {
        let rawQuery = `
            SELECT  user.id,
                    user.first_name ,
                    user.last_name,
                    CONCAT_WS(' ', user.first_name, user.last_name) AS fullName,
                    user.phone_number,
                    user.gender,
                    user.birthday,
                    user.ssn,
                    user.is_enabled AS isEnabled,
                    user.is_email_confirmed AS isEmailConfirmed,
                    user.portrait,
                    user.createdAt,
                    user.updatedAt,
                    auth.id AS 'auth.id',
                    auth.email AS 'auth.email',
                    address.id AS 'address.id',
                    address.address AS 'address.address',
                    address.zip AS 'address.zip',
                    address_city.id AS 'address.city.id',
                    address_city.city AS 'address.city.city',
                    address_city.zip AS 'address.city.zip',
                    address_city.lat AS 'address.city.lat',
                    address_city.lng AS 'address.city.lng',
                    address_state.id AS 'address.state.id',
                    address_state.state AS 'address.state.state',
                    address_state.code AS 'address.state.code',
                    details.id AS 'details.id',
                    details.is_available AS 'details.isAvailable',
                    details.is_pro AS 'details.isPro',
                    details.car_license_plate_number,
                    details.latitude AS 'details.latitude',
                    details.longitude AS 'details.longitude',
                    details.rating AS 'details.rating',
                    details.is_bg_check_completed AS 'details.isBGCheckCompleted',
                    details_workingHours.id AS 'details.workingHours.id',
                    details_workingHours.time_from AS 'details.workingHours.timeFrom',
                    details_workingHours.time_to AS 'details.workingHours.timeTo'
            FROM users as user
            LEFT JOIN auth ON auth.user = user.id
            LEFT JOIN addresses AS address ON address.user_id = user.id
            LEFT JOIN cities AS address_city ON address_city.id = address.city_id
            LEFT JOIN states AS address_state ON address_state.id = address.state_id
            LEFT JOIN user_details AS details ON details.user_id = user.id
            LEFT JOIN working_hours AS details_workingHours ON details_workingHours.id = details.id
            WHERE details.user_id IS NOT NULL
            AND user.is_enabled = true
            AND (
                 details.latitude >= ${params.southWestLatitude}
                 AND details.longitude >= ${params.southWestLongitude}
                 AND details.latitude <= ${params.northEastLatitude}
                 AND details.longitude <= ${params.northEastLongitude}
                 )`;
        rawQuery += !params.isAllShown || !JSON.parse(params.isAllShown) ?
            ` AND details.is_available = true` : '';

        let userQueryAsync = promise.promisify(User.query);

        return userQueryAsync(rawQuery)
            .then(
                (users) => {

                    return HelperService.formatQueryResult(users);
                }
            );
    },
    create(user) {

        return User.create(user);
    },
    updateUser(user) {
        if(user.auth && user.auth.password) {

            delete user.auth.password;
        }

        return User.update({id: user.id}, user)
            .then(
                (updatedUser) => {
                    if (!updatedUser || updatedUser.length === 0) {

                        return Promise.reject();
                    }

                    return this.getUser(updatedUser[0]);
                }
            );
    },
    getUserBySSN(ssn) {

        return User.findOneBySsn(ssn);
    },
    getUserByPhoneNumber(phoneNumber) {

        return User.findOneByPhoneNumber(phoneNumber);
    }
};

module.exports = UserService;
