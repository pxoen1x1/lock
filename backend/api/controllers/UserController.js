'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UserController = {
    getUsers: (req, res) => {
        User.find()
            .sort('lastName DESC')
            .exec((err, users) => {
                if (err) {

                    return res.serverError('Server Error');
                }

                res.send({
                    users: users
                });
            });
    },
    createUser: (req, res) => {
        let user = req.body;

        User.create(user)
            .exec((err, user) => {
                if (err) {

                    return res.serverError(err.details);
                }

                res.send(user);
            });
    }
};

module.exports = UserController;

