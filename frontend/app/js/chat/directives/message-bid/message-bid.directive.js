(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('messageBid', messageBid);

    function messageBid() {
        var directive = {
            bindToController: true,
            controller: MessageBidController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                chats: '=',
                bids: '=',
                currentUser: '=',
                currentBid: '=',
                currentChat: '=',
                currentRequest: '=',
                selectedTab: '=',
                acceptOffer: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/message-bid/message-bid.html'
        };

        return directive;
    }

    MessageBidController.$inject = [
        '$scope',
        '$mdDialog',
        'coreConstants',
        'chatConstants',
        'chatSocketservice',
        'mobileService'
    ];

    /* @ngInject */
    function MessageBidController($scope, $mdDialog, coreConstants, chatConstants, chatSocketservice, mobileService) {
        var vm = this;

        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;
        vm.messageType = chatConstants.MESSAGE_TYPES;

        vm.startChat = startChat;
        vm.acceptBid = acceptBid;
        vm.declineBid = declineBid;
        vm.showPaymentModal = showPaymentModal;

        function createChat(bid) {
            var request = bid.request;
            var member = {
                member: bid.specialist
            };

            return chatSocketservice.createChat(request, member)
                .then(function (createdChat) {

                    return createdChat;
                });
        }

        function deleteBid(bid) {

            return chatSocketservice.deleteBid(bid)
                .then(function (bid) {

                    return bid;
                });
        }

        function startChat(currentBid, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            return createChat(currentBid)
                .then(function (createdChat) {

                    return deleteBid(currentBid)
                        .then(function (deletedBid) {
                            vm.bids = vm.bids.filter(function (bid) {

                                return bid.id !== deletedBid.id;
                            });

                            vm.chats.unshift(createdChat);

                            vm.currentBid = null;
                            vm.currentChat = createdChat;
                            vm.selectedTab = 'chats';
                        });
                });
        }

        function acceptBid(currentBid, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            var offer = {
                cost: currentBid.cost,
                executor: currentBid.specialist
            };

            var message = {
                message: currentBid.message,
                cost: currentBid.cost,
                type: vm.messageType.AGREEMENT
            };

            return startChat(currentBid, currentRequest)
                .then(function () {

                    return $scope.$applyAsync(function () {

                        return vm.acceptOffer({offer: offer, message: message});
                    });
                });
        }

        function declineBid(currentBid, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            return chatSocketservice.declineBid(currentBid)
                .then(function (updatedBid) {
                    vm.bids = vm.bids.filter(function (bid) {

                        return bid.id !== updatedBid.id;
                    });

                    vm.currentBid = null;
                    vm.selectedTab = vm.bids.length > 0 ? vm.selectedTab : 'chats';
                });
        }


        function showPaymentModal(ev) {
            $mdDialog.show({
                controller: 'PaymentDialogController',
                controllerAs: 'vm',
                templateUrl: 'chat/payment-dialog/payment-dialog.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {currentBid: vm.currentBid, currentRequest: vm.currentRequest}
            })
                .then(function (paymentResult) {
                    if (paymentResult) {
                        vm.acceptBid(vm.currentBid, vm.currentRequest);
                    }
                });
        };

    }
})();