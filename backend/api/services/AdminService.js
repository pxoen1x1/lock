/* global User, Auth, Address, UserDetail, Request, Feedback, Chat, Bid, Message, HelperService */

'use strict';

let promise = require('bluebird');
let getUsersRawQuery = `SELECT  user.id,
                    user.first_name ,
                    user.last_name,
                    CONCAT_WS(' ', user.first_name, user.last_name) AS fullName,
                    user.phone_number,
                    user.gender,
                    user.birthday,
                    user.is_enabled AS isEnabled,
                    user.is_email_confirmed AS isEmailConfirmed,
                    user.portrait,
                    user.createdAt,
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
                    details.is_available AS 'details.isAvailable'
            FROM users as user
            LEFT JOIN auth ON auth.user = user.id
            LEFT JOIN addresses AS address ON address.user_id = user.id
            LEFT JOIN cities AS address_city ON address_city.id = address.city_id
            LEFT JOIN states AS address_state ON address_state.id = address.state_id
            LEFT JOIN user_details AS details ON details.user_id = user.id`;
let getUsersCountRawQuery = `SELECT COUNT(user.id) AS count
            FROM users as user
            LEFT JOIN auth ON auth.user = user.id
            LEFT JOIN addresses AS address ON address.user_id = user.id
            LEFT JOIN cities AS address_city ON address_city.id = address.city_id
            LEFT JOIN states AS address_state ON address_state.id = address.state_id
            LEFT JOIN user_details AS details ON details.user_id = user.id`;

let AdminService = {
    getUsers(criteria) {
        let tableAlias = '';
        let rawQuery = HelperService.buildQuery(getUsersRawQuery, criteria, tableAlias);

        let usersQueryAsync = promise.promisify(User.query);

        return usersQueryAsync(rawQuery)
            .then(
                (users) => {

                    return HelperService.formatQueryResult(users);
                }
            );
    },
    getUsersCount(criteria) {
        let tableAlias = '';
        let rawQuery = HelperService.buildQuery(getUsersCountRawQuery, criteria, tableAlias);

        let usersCountQueryAsync = promise.promisify(User.query);

        return usersCountQueryAsync(rawQuery)
            .then(
                (count) => count[0].count
            );
    },
    deleteUser(userId) {
        return User.destroy({id: userId})
            .then(
                () => {
                    Auth.destroy({user: userId})
                        .then(
                            (auth) => {

                                return auth;
                            }
                        );
                }
            )
            .then(
                () => {
                    Address.destroy({user_id: userId})
                        .then(
                            (addresses) => {

                                return addresses;
                            }
                        );
                }
            )
            .then(
                () => {
                    UserDetail.destroy({user_id: userId})
                        .then(
                            (userDetails) => {

                                return userDetails;
                            }
                        );
                }
            )
            .then(
                () => {
                    Request.destroy({
                        or: [
                            {owner_id: userId},
                            {executor_id: userId}
                        ]
                    })
                        .then(
                            (requests) => {

                                return requests;
                            }
                        );
                }
            )
            .then(
                () => {
                    Feedback.destroy({
                        or: [
                            {author_id: userId},
                            {executor_id: userId}
                        ]
                    })
                        .then(
                            (feedbacks) => {

                                return feedbacks;
                            }
                        );
                }
            )
            .then(
                () => {
                    Chat.destroy({
                        or: [
                            {client_id: userId},
                            {specialist_id: userId}
                        ]
                    })
                        .then(
                            (chats) => {

                                return chats;
                            }
                        );
                }
            )
            .then(
                () => {
                    Bid.destroy({
                        or: [
                            {client_id: userId},
                            {specialist_id: userId}
                        ]
                    })
                        .then(
                            (bids) => {

                                return bids;
                            }
                        );
                }
            )
            .then(
                () => {
                    Message.destroy({
                        or: [
                            {sender_id: userId},
                            {recipient_id: userId}
                        ]
                    })
                        .then(
                            (messages) => {

                                return messages;
                            }
                        );
                }
            );
    }
};

module.exports = AdminService;
