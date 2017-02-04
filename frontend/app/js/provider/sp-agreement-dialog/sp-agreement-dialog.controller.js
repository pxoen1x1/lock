(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('SpAgreementDialogController', SpAgreementDialogController);

    SpAgreementDialogController.$inject = ['$mdDialog'];

    /* @ngInject */
    function SpAgreementDialogController($mdDialog) {
        var vm = this;

        vm.agree = agree;
        vm.notAgree = notAgree;


        function agree() {
            $mdDialog.hide({result: true});
        }

        function notAgree() {
            $mdDialog.hide();
        }
    }
})();

