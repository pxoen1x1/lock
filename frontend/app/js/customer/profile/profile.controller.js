(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['currentUserService'];

    /* @ngInject */
    function CustomerProfileController(currentUserService) {
        var vm = this;

        vm.profileData = {};
        vm.isEditing = false;
        
        vm.updateUser = updateUser;
        vm.getUser = getUser;
        vm.selectFile = selectFile;

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
                .then(function (user) {

                    vm.profileData = user;

                    return vm.profileData;
                });
        }
        
        function selectFile() {
            return document.getElementsByClassName('select-file-hidden')[0].click();
        }

        function activate() {
            getUser();
        }
    }
})();