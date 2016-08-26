/* global sails, User, UserDetailService */

'use strict';

let bcryptjs = require('bcryptjs');
let crypto = require('crypto');
let promise = require('bluebird');

let UserService = {
    getUser(user) {
        let promise = new Promise((resolve, reject) => {
                User.findOneById(user.id)
                    .populate('addresses')
                    .exec(
                        (err, foundUser) => {
                            if (err) {

                                return reject(err);
                            }

                            UserDetailService.getUserDetailByUser(foundUser)
                                .then(
                                    (userDetails) => {
                                        foundUser.details = userDetails;

                                        return resolve(foundUser);
                                    }
                                )
                                .catch(
                                    (err) => reject(err)
                                );
                        }
                    );
            }
        );

        return promise;
    },
    findServiceProviders(params) {
        let rawQuery = `
            SELECT  users.id,
                    users.first_name AS 'firstName',
                    users.last_name AS 'lastName',
                    CONCAT_WS(' ', users.first_name, users.last_name) AS fullName,
                    users.phone_number AS 'phoneNumber',
                    users.gender,
                    users.birthday,
                    users.email,
                    users.ssn,
                    users.is_enabled AS isEnabled,
                    users.is_email_confirmed AS isEmailConfirmed,
                    users.portrait,
                    users.createdAt,
                    users.updatedAt,
                    details.id AS detailsId,
                    details.is_available AS detailsIsAvailable,
                    details.is_pro AS detailsIsPro,
                    addresses.id AS addressId,
                    addresses.address AS addressAddress,
                    addresses.zip AS addressZip,
                    cities.id AS cityId,
                    cities.city AS cityCity,
                    cities.zip AS cityZip,
                    cities.lat AS cityLat,
                    cities.lng AS cityLng,
                    states.id AS stateId,
                    states.state AS stateState,
                    states.code AS stateCode,
                    locations.id AS locationId,
                    locations.address AS locationAddress,
                    locations.latitude AS locationLatitude,
                    locations.longitude AS locationLongitude,
                    licenses.id AS licensesId,
                    licenses.number AS licensesNumber,
                    licenses.date AS licensesDate,
                    working_hours.id AS workingHoursId,
                    working_hours.time_from AS workingHoursTimeFrom,
                    working_hours.time_to AS workingHoursTimeTo
            FROM users
            LEFT JOIN addresses ON addresses.user_id = users.id
            LEFT JOIN cities ON cities.id = addresses.city_id
            LEFT JOIN states ON states.id = addresses.state_id
            LEFT JOIN user_details AS details ON details.user_id = users.id
            LEFT JOIN locations ON locations.id = details.location_id
            LEFT JOIN licenses ON licenses.id = details.location_id
            LEFT JOIN working_hours ON working_hours.id = details.location_id
            WHERE details.user_id IS NOT NULL
            AND users.is_enabled = true
            AND (
                     locations.latitude >= ${params.southWestLatitude}
                 AND locations.longitude >= ${params.southWestLongitude}
                 AND locations.latitude <= ${params.northEastLatitude}
                 AND locations.longitude <= ${params.northEastLongitude}
                 )`;
        rawQuery += !params.isAllShown || !JSON.parse(params.isAllShown) ?
            ` AND details.is_available = true` : '';

        let userQueryAsync = promise.promisify(User.query);

        return userQueryAsync(rawQuery)
            .then(
                (users) => {
                    users = users.map(function (user) {
                        let result = {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            fullName: user.fullName,
                            phoneNumber: user.phoneNumber,
                            gender: user.gender,
                            birthday: user.birthday,
                            ssn: user.ssn,
                            isEnabled: user.isEnabled,
                            isEmailConfirmed: user.isEmailConfirmed,
                            portrait: user.portrait,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        };

                        if(!user.detailsId) {

                            return result;
                        }

                        result.details = {
                            id: user.detailsId,
                            isAvailable: user.detailsIsAvailable,
                            isPro: user.detailsIsPro
                        };

                        if (user.addressId) {
                            result.details.addresses = {
                                id: user.addressId,
                                address: user.addressAddress,
                                zip: user.addressZip
                            };

                            result.details.addresses.city = {
                                id: user.cityId,
                                city: user.cityCity,
                                zip: user.cityZip,
                                lat: user.cityLat,
                                lng: user.cityLng
                            };

                            result.details.addresses.state = {
                                id: user.stateId,
                                state: user.stateState,
                                code: user.stateCode
                            };
                        }

                        if (user.locationId) {
                            result.details.location = {
                                id: user.locationId,
                                address: user.locationAddress,
                                latitude: user.locationLatitude,
                                longitude: user.locationLongitude
                            };
                        }

                        if (user.licensesId) {
                            result.details.license = {
                                id: user.licensesId,
                                number: user.licensesNumber,
                                date: user.licensesDate
                            };
                        }

                        if (user.workingHoursId) {
                            result.details.workingHours = {
                                id: user.workingHoursId,
                                timeFrom: user.workingHoursTimeFrom,
                                timeTo: user.workingHoursTimeTo
                            };
                        }

                        return result;
                    });

                    return users;
                }
            );
    },
    create(user) {
        let promise = new Promise(
            (resolve, reject) => {
                User.create(user)
                    .exec((err, createdUser) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(createdUser);
                    });
            });

        return promise;
    },
    update(queryKey, updatedUser) {
        let promise = new Promise((resolve, reject) => {
            User.findOne(queryKey)
                .exec((err, user) => {
                    if (err) {

                        return reject(err);
                    }

                    if (!user) {

                        return reject();
                    }

                    user = Object.assign(user, updatedUser);

                    user.save(
                        (err) => {
                            if (err) {

                                return reject(err);
                            }

                            return resolve(user);
                        }
                    );
                });
        });

        return promise;
    },
    encryptPassword(password) {
        let promise = new Promise(
            (resolve, reject) => {
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(password, salt,
                        (err, hash) => {
                            if (err) {

                                return reject(err);
                            }

                            return resolve(hash);
                        });
                });
            }
        );

        return promise;
    },
    generateToken() {
        let buffer = crypto.randomBytes(sails.config.application.tokenLength);

        return buffer.toString('hex');
    }
};

module.exports = UserService;