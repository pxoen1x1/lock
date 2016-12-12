/* global sails */
/**
 * Translator Service
 */

'use strict';

let MsTranslator = require('mstranslator');

let mstranslator = sails.config.mstranslator;

let client = new MsTranslator(mstranslator, true);

let TranslatorService = {
    translateText(text, lang){
        let params = {
            text: text,
            to: lang
        };

        let promise = new Promise(
            (resolve, reject) => {
                client.translate(params,
                    (err, translatedText) => {
                        if (err) {

                            return reject(err);
                        }

                        return resolve(translatedText);
                    });
            }
        );

        return promise;
    }
};

module.exports = TranslatorService;
