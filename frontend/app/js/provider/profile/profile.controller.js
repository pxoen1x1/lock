(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = ['currentUserService'];

    /* @ngInject */
    function ProviderProfileController(currentUserService) {
        var vm = this;

        vm.profileData = {};

        vm.datePickerOptions = {
            maxDate: new Date()
        };

        vm.isEditing = false;
        
        vm.updateUser = updateUser;

        activate();

        function updateUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            return currentUserService.setUser(user)
                .then(function (user) {

                    vm.profileData = user;
                    vm.isEditing = false;

                    return vm.profileData;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (response) {

                    vm.profileData = response;

                    return vm.profileData;
                });
        }

        function activate() {
            getUser();
        }
    }
})();