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
                selectSpecialist: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/bid-list/client-bid-list.html'
        };

        return directive;
    }

    ClientBidListController.$inject = ['$q', '$mdMedia', '$mdSidenav', 'chatSocketservice', 'coreConstants', 'conf'];

    /* @ngInject */
    function ClientBidListController($q, $mdMedia, $mdSidenav, chatSocketservice, coreConstants, conf) {
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
            chatSocketservice.onBid(function (bid) {
                vm.bids.unshift(bid);
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

            vm.selectSpecialist({specialist: currentBid.specialist});

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function activate() {
            getBids(vm.currentRequest)
                .then(listenBidEvent);
        }
    }
})();