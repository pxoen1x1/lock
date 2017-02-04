(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('SpAgreementDialogController', SpAgreementDialogController);

    SpAgreementDialogController.$inject = ['$mdDialog', 'localService', 'coreDataservice'];

    /* @ngInject */
    function SpAgreementDialogController($mdDialog, localService, coreDataservice) {
        var vm = this;

        /*
         vm.linkToBGCheck =
         'https://workforce.sterlingdirect.com/InvitationCodePage?InvitationCode=07B2D0F7E5964D-11868A5C';
         */

        vm.agree = agree;
        vm.notAgree = notAgree;

        /*        vm.skipBackgroundCheck = skipBackgroundCheck;

         //ToDo: Just for test. Remove comment from provider.run.js
         function skipBackgroundCheck() {
         var user = localService.getUser();

         if (!user || !user.details) {

         return;
         }

         user.details.isBGCheckCompleted = true;

         localService.setUser(user);

         $mdDialog.hide();
         }*/

        function agree() {
            var user = localService.getUser();

            if (!user || !user.details) {

                return;
            }

            user.details.isSpAgreed = true;

            coreDataservice.updateUser(user)
                .then(function () {
                    localService.setUser(user);
                })
                .then(function () {

                    $mdDialog.hide({result: true});
                });

        }

        function notAgree() {
            $mdDialog.hide();
        }
    }
})();

