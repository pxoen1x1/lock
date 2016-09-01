(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = ['serviceProviderDataservice'];

    /* @ngInject */
    function ProviderProfileController(serviceProviderDataservice) {
        var promises = {
            getUser: null,
            updateUser: null
        };
        
        var vm = this;

        vm.profileData = {};

        vm.datePickerOptions = {
            maxDate: new Date()
        };

        vm.isEditing = false;
        
        vm.updateUser = updateUser;

        activate();

        function updateUser() {
            if (promises.updateUser) {
                promises.updateUser.cancel();
            }

            promises.updateUser = serviceProviderDataservice.updateUser();

            return promises.updateUser
                .then(function (response) {

                    vm.profileData = response.data.user;
                    vm.isEditing = false;

                    return vm.profileData;
                });
        }

        function getUser() {
            if (promises.getUser) {
                promises.getUser.cancel();
            }

            promises.getUser = serviceProviderDataservice.getUser();

            return promises.getUser
                .then(function (response) {

                    vm.profileData = response.data.user;

                    return vm.profileData;
                });
        }

        function activate() {
            getUser();
        }
    }
})();