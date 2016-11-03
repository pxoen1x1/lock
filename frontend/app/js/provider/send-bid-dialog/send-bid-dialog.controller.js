(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SendBidDialogController', SendBidDialogController);

    SendBidDialogController.$inject = ['$mdDialog', 'currentRequest', 'chatSocketservice'];

    /* @ngInject */
    function SendBidDialogController($mdDialog, currentRequest, chatSocketservice) {
        var vm = this;

        vm.bid = {};

        vm.createBid = createBid;
        vm.cancel = cancel;

        activate();

        function createBid(bid, isFormValid) {
            if (!isFormValid) {

                return;
            }

            bid = {
                bid: bid
            };

            return chatSocketservice.createBid(currentRequest, bid)
                .then(function (bid) {

                    $mdDialog.hide(bid);
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
        }
    }
})();