(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('messageChat', messageChat);

    messageChat.$inject = ['$compile', '$templateCache'];

    /* @ngInject */
    function messageChat($compile, $templateCache) {
        var directive = {
            bindToController: true,
            controller: ControllerName,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                message: '=',
                currentUser: '=',
                currentRequest: '=',
                changeRequestStatus: '&'
            },
            replace: true
        };
        return directive;

        function link(scope, element) {
            var vm = scope.vm;

            var messageTemplate = getMessageTemplate(vm.message);

            element.html(messageTemplate);

            $compile(element.contents())(scope);

            function getMessageTemplate(message) {
                var messageTemplate = '';
                var messageType = parseInt(message.type, 10);

                switch (messageType) {
                    case vm.messageType.OFFER :
                        messageTemplate = $templateCache.get('chat/directives/message-chat/message-offer.html');
                        break;
                    default:
                        messageTemplate = $templateCache.get('chat/directives/message-chat/message-chat.html');
                }

                return messageTemplate;
            }
        }
    }

    ControllerName.$inject = ['coreConstants', 'chatConstants'];

    /* @ngInject */
    function ControllerName(coreConstants, chatConstants) {
        var vm = this;

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.messageType = chatConstants.MESSAGE_TYPES;

        vm.acceptOffer = acceptOffer;

        function acceptOffer(message, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            var offer = {
                cost: message.cost,
                executor: message.sender
            };

            var newMessage = {
                message: message.message,
                cost: message.cost,
                type: vm.messageType.AGREEMENT
            };

            return vm.changeRequestStatus({offer: offer, message: newMessage});
        }
    }
})();