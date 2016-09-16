(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['currentUserService', 'coreConstants', 'conf'];

    /* @ngInject */
    function CustomerProfileController(currentUserService, coreConstants, conf) {
        var vm = this;

        vm.profileData = {};
        vm.isEditing = false;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        
        vm.updateUser = updateUser;
        vm.getUser = getUser;

        activate();

        function updateUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }
            
            if (vm.newPortrait) {
                user.portrait = {
                    base64: vm.newPortrait
                };
            }

            return currentUserService.setUser(user)
                .then(function (user) {
                    
                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.profileData;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return vm.profileData;
                });
        }

        function activate() {
            getUser();
        }
    }
})();