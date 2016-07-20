'use strict';

let ViewService = {
    renderView(filePath, options) {
        let promise = new Promise((resolve, reject) => {
            options = options || {layout: false};

            sails.renderView(filePath, options,
                (error, renderedView) => {
                    if (error) {

                        return reject(error);
                    }

                    return resolve(renderedView);
                });
        });

        return promise;
    },
    getEmailTemplate(templatePath, options) {
        options.layout = false;

        return this.renderView(templatePath, options)
            .then(
                (renderedView) => {
                    let template = {};

                    if (renderedView && renderedView.split) {
                        renderedView = renderedView.split(/\r\n|\r|\n{3}/g);

                        template.subject = renderedView[0];
                        template.html = renderedView[1];
                    }

                    return template;
                })
            .catch(
                (error) => sails.log.error(error)
            );
    }
};

module.exports = ViewService;