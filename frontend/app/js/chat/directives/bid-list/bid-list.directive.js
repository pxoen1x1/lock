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

    BidListController.$inject = ['chatSocketservice'];

    /* @ngInject */
    function BidListController(chatSocketservice) {
        var vm = this;

        vm.bids = vm.bids || [];

        activate();

        function getBids(request) {
            if (!request) {

                return;
            }

            return chatSocketservice.getRequestBids(request)
                .then(function (bids) {
                    vm.bids = bids;

                    return vm.bids;
                });
        }

        function activate() {
            getBids(vm.selectedRequest);
        }
    }
})();