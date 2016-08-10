/*global sails, Procedure*/

/**
 * ProcedureController
 *
 * @description :: Server-side logic for managing Procedures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let ProcedureController = {
    getProceduresByService(req, res) {
        let services = req.param('services');

        if (!services || services.length === 0) {

            return;
        }

        Procedure.find({
            service: services
        })
            .exec(
                (err, foundProcedures) => {
                    if (err) {

                        return res.serverError();
                    }

                    res.ok({
                        procedures: foundProcedures
                    });
                }
            );
    }
};

module.exports = ProcedureController;

