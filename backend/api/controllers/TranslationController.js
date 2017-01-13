/* global sails, FileService */

/**
 * TranslationController
 *
 * @description :: Server-side logic for managing Translations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let TranslationController = {

    getTranslations(req, res) {

        let langKey = req.params.langKey;
        let pathToTranslation = `../config/translations/locale-${langKey}.json`

        FileService.readFile(pathToTranslation)
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

