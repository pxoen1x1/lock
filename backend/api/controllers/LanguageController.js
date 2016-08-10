/*global Language*/
/**
 * LanguageController
 *
 * @description :: Server-side logic for managing Languages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let LanguageController = {
    getLanguages(req, res) {
        Language.find()
            .exec(
                (err, foundLanguages) => {
                    if (err) {

                        return res.serverError();
                    }

                    return res.ok({
                        languages: foundLanguages
                    });
                }
            );
    }
};

module.exports = LanguageController;

