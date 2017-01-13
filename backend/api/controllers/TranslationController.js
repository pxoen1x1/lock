/* global sails, FileService */

/**
 * TranslationController
 *
 * @description :: Server-side logic for managing Translations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let TranslationController = {
    getTranslation(req, res) {
        let langKey = req.params.langKey;
        let pathToTranslation = __dirname + `/../../config/translations/locale-${langKey}.json`;
        let encoding = 'utf8';

        FileService.readFile(pathToTranslation, encoding)
            .then(
                (translation) => res.ok(
                    {
                        translation: translation
                    }
                )

            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    let message = err.isToSend ? {message: err.message} : null;

                    return res.serverError(message);
                }
            );
    }
};

module.exports = TranslationController;

