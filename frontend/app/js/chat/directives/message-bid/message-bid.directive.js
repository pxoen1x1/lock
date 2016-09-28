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
                messages: '=',
                bids: '=',
                currentBid: '='
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
    }
})();