(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('clientBidList', clientBidList);

    function clientBidList() {
        var directive = {
            bindToController: true,
            controller: ClientBidListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                bids: '=',
                currentBid: '=',
                currentRequest: '=',
                chatSearch: '=?'
            },
            replace: true,
            templateUrl: 'chat/directives/bid-list/client-bid-list.html'
        };

        return directive;
    }

    ClientBidListController.$inject = [
        '$scope',
        '$q',
        '$mdMedia',
        '$mdSidenav',
        'chatSocketservice',
        'coreConstants',
        'conf'
    ];

    /* @ngInject */
    function ClientBidListController($scope, $q, $mdMedia, $mdSidenav, chatSocketservice, coreConstants, conf) {
        var bidHandler;
        var vm = this;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.changeCurrentBid = changeCurrentBid;

        activate();

        function getBids(request) {
            if (!request || !request.id) {

                return $q.reject();
            }

            return chatSocketservice.getRequestBids(request)
                .then(function (bids) {
                    vm.bids = bids;

                    return vm.bids;
                });
        }

        function listenBidEvent() {
            bidHandler = chatSocketservice.onBid(function (bid, type) {
                if (type === 'create') {
                    vm.bids.unshift(bid);
                }
            });
        }

        function changeCurrentBid(currentBid) {
            if (currentBid === null) {
                vm.currentBid = null;

                return;
            }

            if (vm.currentBid && vm.currentBid.id === currentBid.id) {

                return;
            }

            vm.currentBid = currentBid;

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function activate() {
            getBids(vm.currentRequest)
                .then(listenBidEvent);

            $scope.$on('$destroy', function () {
                chatSocketservice.offBid(bidHandler);
            });
        }
    }
})();