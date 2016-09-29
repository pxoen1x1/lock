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
                currentBid: '=',
                currentChat: '=',
                selectedTab: '=',
                changeRequestStatus: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/message-bid/message-bid.html'
        };

        return directive;
    }

    MessageBidController.$inject = ['chatSocketservice', 'coreConstants'];

    /* @ngInject */
    function MessageBidController(chatSocketservice, coreConstants) {
        var vm = this;

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.startChat = startChat;
        vm.acceptBid = acceptBid;

        function createChat(bid) {
            var request = bid.request;
            var specialist = {
                specialist: bid.specialist
            };

            return chatSocketservice.createChat(request, specialist)
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

        function startChat(currentBid) {

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

        function acceptBid(bid) {
            var offer = {
                    cost: bid.cost,
                    executor: bid.specialist
            };

            return vm.changeRequestStatus({offer: offer})
                .then(function (request) {

                    return request;
                });
        }
    }
})();