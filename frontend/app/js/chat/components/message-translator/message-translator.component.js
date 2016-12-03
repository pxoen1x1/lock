(function () {
    'use strict';

    var messageTranslatorConfig = {
        controller: MessageTranslatorController,
        controllerAs: 'vm',
        templateUrl: 'chat/components/message-translator/message-translator.html',
        replace: true,
        bindings: {
            message: '='
        }
    };

    angular
        .module('app.chat')
        .component('messageTranslator', messageTranslatorConfig);

    MessageTranslatorController.$inject = ['chatSocketservice', 'usingLanguageService'];

    /* @ngInject */
    function MessageTranslatorController(chatSocketservice, usingLanguageService) {
        var originalMessage = '';

        var vm = this;

        vm.translateMessage = translateMessage;

        function translateMessage(message) {
            if (vm.isMessageTranslated) {
                message.message = originalMessage;
                vm.isMessageTranslated = false;

                return;
            }

            var language = {
                lang: usingLanguageService.getLanguage()
            };

            originalMessage = message.message;

            chatSocketservice.translateMessage(message, language)
                .then(function (translatedMessage) {
                    if (translatedMessage.id !== message.id) {

                        return;
                    }

                    vm.isMessageTranslated = true;

                    message.message = translatedMessage.message;
                });
        }
    }
})();

