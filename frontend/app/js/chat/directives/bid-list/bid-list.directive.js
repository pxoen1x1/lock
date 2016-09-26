(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('bidList', bidList);

    function bidList() {
        var directive = {
            bindToController: true,
            controller: BidListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                bids: '=',
                currentBid: '=',
                selectedRequest: '='
            },
            replace: true,
            templateUrl: 'chat/directives/bid-list/bid-list.html'
        };

        return directive;
    }

    BidListController.$inject = ['$q', 'chatSocketservice'];

    /* @ngInject */
    function BidListController($q, chatSocketservice) {
        var vm = this;

        vm.bids = vm.bids || [];

        activate();

        function getBids(request) {
            if (!request) {

                $q.request();
            }

            return chatSocketservice.getRequestBids(request)
                .then(function (bids) {
                    vm.bids = bids;

                    return vm.bids;
                });
        }

        function listenBidEvent() {
            chatSocketservice.onBid(function (bid) {
                vm.bids.push(bid);
            });
        }

        function activate() {
            getBids(vm.selectedRequest)
                .then(listenBidEvent);
        }
    }
})();