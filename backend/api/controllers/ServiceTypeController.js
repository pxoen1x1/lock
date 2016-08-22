/*global ServiceType*/
/**
 * ServiceTypeController
 *
 * @description :: Server-side logic for managing Services
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let ServiceTypeController = {
    getServiceTypes(req, res) {
        ServiceType.find()
            .exec(
                (err, foundServiceTypes) => {
                    if (err) {

                        return res.serverError();
                    }

                    return res.ok({
                        serviceTypes: foundServiceTypes
                    });
                }
            );
    }
};

module.exports = ServiceTypeController;

