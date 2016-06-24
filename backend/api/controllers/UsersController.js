'use strict';
/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UsersController = {
    getUsers: (req, res) => {
        Users.find()
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
        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };

        Users.create(user)
            .exec((err, user) => {
                if (err) {

                    return res.serverError(err.details);
                }

                res.send(user);
            });
    }
};

module.exports = UsersController;

