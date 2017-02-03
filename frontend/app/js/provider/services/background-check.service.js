(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('backgroundCheckService', backgroundCheckService);

    backgroundCheckService.$inject = ['$mdDialog', 'currentUserService'];

    /* @ngInject */
    function backgroundCheckService($mdDialog, currentUserService) {
        var service = {
            isBackgroundCheckCompleted: isBackgroundCheckCompleted,
            showBackgroundCheckDialog: showBackgroundCheckDialog
        };

        return service;

        function isBackgroundCheckCompleted() {
            return currentUserService.getUser()
                .then(function (currentUser) {

                    return !currentUser.details || currentUser.details.isBGCheckCompleted;
                });
        }

        function showBackgroundCheckDialog() {
            $mdDialog.show(
                {
                    controller: 'BackgroundCheckController',
                    controllerAs: 'vm',
                    templateUrl: 'provider/background-check-dialog/background-check-dialog.html',
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    hasBackdrop: true
                }
            );
        }
    }
})();