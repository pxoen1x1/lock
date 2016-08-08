/*global Service*/
/**
 * ServiceController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let ServiceController = {
    getServices(req, res) {
        Service.find()
            .exec(
                (err, foundServices) => {
                    if (err) {

                        return res.serverError();
                    }

                    return res.ok({
                        services: foundServices
                    });
                }
            );
    }
};

module.exports = ServiceController;

