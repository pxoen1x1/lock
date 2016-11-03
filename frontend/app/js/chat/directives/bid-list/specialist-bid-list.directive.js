(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('specialistBidList', specialistBidList);

    function specialistBidList() {
        var directive = {
            bindToController: true,
            controller: SpecialistBidListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                bids: '=',
                currentBid: '=',
                currentRequest: '=',
                changeCurrentRequest: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/bid-list/specialist-bid-list.html'
        };

        return directive;
    }

    SpecialistBidListController.$inject = ['$mdMedia', '$mdSidenav', 'chatSocketservice', 'coreConstants', 'conf'];

    /* @ngInject */
    function SpecialistBidListController($mdMedia, $mdSidenav, chatSocketservice, coreConstants, conf) {
        var vm = this;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.changeCurrentBid = changeCurrentBid;

        activate();

        function getBids() {

            return chatSocketservice.getSpecialistBids()
                .then(function (bids) {
                    vm.bids = bids;

                    return vm.bids;
                });
        }

        function listenBidEvent() {
            chatSocketservice.onBid(function (bid, type) {
                if (type !== 'create') {

                    return;
                }

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

            vm.changeCurrentRequest({request: currentBid.request});

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function activate() {
            getBids()
                .then(listenBidEvent);
        }
    }
})();