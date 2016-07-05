'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getUsers: (req, res) => {
        User.find()
            .sort('lastName DESC')
            .exec((err, users) => {
                debugger;
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
            firstName: req.params('firstName'),
            lastName: req.params('lastName'),
            email: req.params('email'),
            password: req.params('password')
        };

        User.create(user)
            .exec((err, user) => {
                if (err) {

                    return res.serverError();
                }

                res.send(user);
            });
    }
};
