/* global sails, Language */

/**
 * isMessageAllowed
 *
 * @module      :: Policy
 * @description :: Assumes that language exist in database;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

module.exports = function (req, res, next) {
    let language = req.body.lang;

    if (!language || !language.id) {
        sails.log.debug(new Error('Submitted data is invalid.'));


        return res.badRequest({
            message: req.__('Submitted data is invalid.')
        });
    }

    Language.findOneById(language.id)
        .then(
            (foundLanguage) => {
                if (!foundLanguage) {
                    sails.log.debug(new Error(`Language ${language.id} is not supported.`));


                    return res.notFound(
                        {
                            message: req.__('Language is not found.')
                        }
                    );
                }

                next();
            }
        )
        .catch(
            (err) => {
                sails.log.error(err);

                res.serverError();
            }
        );
};
