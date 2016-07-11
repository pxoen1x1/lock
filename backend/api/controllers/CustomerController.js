'use strict';
/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/*let path = require('path');
 let appRoot = path.resolve(process.cwd());
 let mailerService = require(`${appRoot}/api/services/Mailer`);*/


let CustomerController = {
    createCustomer: (req, res) => {
        let user = req.body;

        async.waterfall([
                async.apply(createUser, user, res)
            ],
            (err, createdUser) => {
                MailerService.successRegistration(createdUser);
            });
    },
    updateCustomer: (req, res) => {
        let id = req.params.id;
        let user = req.body;

        if (!id || Object.keys(user).length === 0) {

            return res.badRequest({message: 'Please, check data.'});
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

                        return res.serverError();
                    }

                    if (updatedUser.length === 0) {

                        return res.badRequest({message: 'User not found.'});
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

function createUser(user, res, done) {
    UserService.create(user)
        .then(
            (createdUser)=> {
                res.ok({user: createdUser});
                done(null, createdUser);
            })
        .catch(
            (err) => {
                res.serverError(err);
            });
}

module.exports = CustomerController;
