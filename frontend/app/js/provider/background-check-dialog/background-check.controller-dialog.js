(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('BackgroundCheckController', BackgroundCheckController);

    BackgroundCheckController.$inject = ['$mdDialog', 'localService'];

    /* @ngInject */
    function BackgroundCheckController($mdDialog, localService) {
        var vm = this;

        vm.linkToBGCheck =
            'https://workforce.sterlingdirect.com/InvitationCodePage?InvitationCode=07B2D0F7E5964D-11868A5C';

        vm.skipBackgroundCheck = skipBackgroundCheck;

        function skipBackgroundCheck() {
            var user = localService.getUser();

            if (!user || !user.details) {

                return;
            }

            user.details.isBGCheckCompleted = true;

            localService.setUser(user);

            $mdDialog.hide();
        }
    }
})();

