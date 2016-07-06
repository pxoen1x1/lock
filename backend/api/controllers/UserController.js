'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UserController = {
    getUsers: (req, res) => {
        res.send(req.user);
    }
};

module.exports = UserController;

