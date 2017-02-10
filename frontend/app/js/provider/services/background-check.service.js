(function () {
    'use strict';

    angular
        .module('app.provider')
        .factory('backgroundCheckService', backgroundCheckService);

    backgroundCheckService.$inject = ['$mdDialog', 'coreDataservice'];

    /* @ngInject */
    function backgroundCheckService($mdDialog, coreDataservice) {
        var service = {
            isBackgroundCheckCompleted: isBackgroundCheckCompleted,
            showBackgroundCheckDialog: showBackgroundCheckDialog
        };

        return service;

        function isBackgroundCheckCompleted() {

            return coreDataservice.getCurrentUser()
                .then(function (currentUser) {

                    return !currentUser.details || currentUser.details.isBGCheckCompleted;
                });
        }

        function showBackgroundCheckDialog() {

            return $mdDialog.show(
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