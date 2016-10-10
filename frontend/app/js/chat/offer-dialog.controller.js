(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('OfferDialogController', OfferDialogController);

    OfferDialogController.$inject = ['$mdDialog', 'chatConstants'];

    /* @ngInject */
    function OfferDialogController($mdDialog, chatConstants) {
        var vm = this;

        vm.offer = {};
        vm.offer.type = chatConstants.MESSAGE_TYPES.OFFER;

        vm.sendOffer = sendOffer;
        vm.cancel = cancel;

        activate();

        function sendOffer(offer, isFormValid) {
            if (!isFormValid) {

                return;
            }

            $mdDialog.hide(offer);
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
        }
    }
})();