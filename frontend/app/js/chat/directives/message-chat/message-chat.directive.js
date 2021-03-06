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
            controller: MessageChatController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                message: '=',
                currentUser: '=',
                currentRequest: '=',
                currentChat: '=',
                selectedSpecialist: '=',
                acceptOffer: '&',
                updateRequestStatus: '&',
                toggleSidenav: '&'
            },
            replace: true
        };
        return directive;

        function link(scope, element) {
            var vm = scope.vm;

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

                var regexImage = /^.+\.(?:jpg|jpeg|png|gif)$/;

                vm.isImage = regexImage.test(message.message);

                if (vm.isImage) {

                    return $templateCache.get('chat/directives/message-chat/message-chat.html');
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

    MessageChatController.$inject = [
        '$mdDialog',
        'conf',
        'coreConstants',
        'chatConstants',
        'mobileService',
        'coreDataservice',
    ];

    /* @ngInject */
    function MessageChatController($mdDialog, conf, coreConstants, chatConstants, mobileService, coreDataservice) {
        var vm = this;

        vm.isImage = false;
        vm.isMessageTranslated = false;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.messageType = chatConstants.MESSAGE_TYPES;
        vm.userType = coreConstants.USER_TYPES;

        vm.mapOptions = {
            scrollwheel: false,
            disableDoubleClickZoom: true
        };

        vm.confirmOffer = confirmOffer;
        vm.changeRequestStatus = changeRequestStatus;
        vm.showChatMemberInfo = showChatMemberInfo;
        vm.showPaymentModal = showPaymentModal;

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

        function showChatMemberInfo(selectedMember) {
            if (vm.currentUser.type !== vm.userType.CLIENT || selectedMember.id === vm.currentUser.id) {

                return;
            }

            return coreDataservice.getUser(selectedMember.id)
                .then(function(response) {
                    vm.selectedSpecialist = response.data.user;
                    vm.toggleSidenav({ navID: 'right-sidenav' });
                });
        }

        function showPaymentModal(ev) {

            var offer = {
                cost: vm.message.cost,
                executor: vm.message.sender
            }

            $mdDialog.show({
                    controller: 'PaymentDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'chat/payment-dialog/payment-dialog.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {offer: offer, currentRequest: vm.currentRequest}
                })
                .then(function (paymentResult) {
                    if (paymentResult) {
                        vm.confirmOffer(vm.message, vm.currentRequest);
                    }
                });
        };
    }
})();