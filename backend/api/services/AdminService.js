/* global sails, User, Auth, Address, UserDetail, Request, Feedback, Chat, Bid, Message, HelperService */

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
                    auth.email AS 'auth.email'
            FROM users as user
            LEFT JOIN auth ON auth.user = user.id`;

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

        return User.count(criteria)
            .then(
                (count) => count
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
