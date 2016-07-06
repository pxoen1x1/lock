'use strict';
/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let CustomerController = {
    createCustomer: (req, res) => {
        let user = req.body;

        User.create(user)
            .exec((err, user) => {
                if (err) {

                    return res.serverError(err.details);
                }

                res.send(
                    {
                        user: user
                    }
                );
            });
    },
    updateCustomer: (req, res) => {
        let id = req.params.id;
        let user = req.body;

        if (!id || Object.keys(user).length === 0) {

            return res.badRequest();
        }

        if (user.password) {
            delete user.password;
        }

        if (user.id) {
            delete user.id;
        }

        User.update({id: id}, user)
            .exec(
                (err, updatedUser) => {
                    if (err) {

                        return res.serverError(err.details);
                    }

                    if (updatedUser.length === 0) {

                        return res.badRequest('User not found.');
                    }

                    res.ok(
                        {
                            user: updatedUser[0]
                        }
                    );
                }
            );
    }
};

module.exports = CustomerController;
