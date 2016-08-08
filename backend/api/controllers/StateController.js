/*global State*/

/**
 * StateController
 *
 * @description :: Server-side logic for managing States
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let StateController = {
    getStates(req, res) {
        State.find()
            .exec(
                (err, states) => {
                    if (err) {

                        res.serverError();
                    }

                    res.ok({
                        items: states
                    });
                }
            );
    }
};

module.exports = StateController;

