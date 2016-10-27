(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('messageChat', messageChat);

    messageChat.$inject = ['$compile', '$templateCache', 'coreConstants'];

    /* @ngInject */
    function messageChat($compile, $templateCache, coreConstants) {
        var directive = {
            bindToController: true,
            controller: MessageChatController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                message: '=',
                currentUser: '=',
                currentRequest: '=',
                currentChat: '=',
                acceptOffer: '&',
                updateRequestStatus: '&'
            },
            replace: true
        };
        return directive;

        function link(scope, element) {
            var vm = scope.vm;

            vm.userType = coreConstants.USER_TYPES;

            var messageTemplate = getMessageTemplate(vm.message);

            if (!messageTemplate) {

                return;
            }

            element.html(messageTemplate);

            $compile(element.contents())(scope);

            function getMessageTemplate(message) {
                var messageTemplate = '';
                var messageType = parseInt(message.type, 10);

                if (messageType === vm.messageType.AGREEMENT && vm.currentUser.type === vm.userType.CLIENT) {

                    return;
                }

                switch (messageType) {
                    case vm.messageType.OFFER :
                        messageTemplate = $templateCache.get('chat/directives/message-chat/message-offer.html');
                        break;
                    case vm.messageType.AGREEMENT :
                        messageTemplate = $templateCache.get('chat/directives/message-chat/message-agreement.html');
                        break;
                    default:
                        messageTemplate = $templateCache.get('chat/directives/message-chat/message-chat.html');
                }

                return messageTemplate;
            }
        }
    }

    MessageChatController.$inject = ['coreConstants', 'chatConstants', 'conf', 'geocoderService'];

    /* @ngInject */
    function MessageChatController(coreConstants, chatConstants, conf, geocoderService) {
        var vm = this;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.messageType = chatConstants.MESSAGE_TYPES;
        vm.userType = coreConstants.USER_TYPES;

        vm.confirmOffer = confirmOffer;
        vm.changeRequestStatus = changeRequestStatus;

        function confirmOffer(message, currentRequest) {
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

            return vm.acceptOffer({offer: offer, message: newMessage});
        }

        function changeRequestStatus(request, status) {
            if (!request || !status) {

                return;
            }

            status = {
                status: status
            };

            vm.updateRequestStatus({request: request, status: status});
        }
    }
})();