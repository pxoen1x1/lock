(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['customerDataservice'];

    /* @ngInject */
    function CustomerProfileController(customerDataservice) {
        var promises = {
            getUser: null,
            updateUser: null
        };

        var vm = this;

        vm.profileData = {};
        vm.isEditing = false;

        vm.updateUser = updateUser;
        vm.getUser = getUser;

        activate();

        function updateUser() {
            if (promises.updateUser) {
                promises.updateUser.cancel();
            }

            promises.updateUser = customerDataservice.updateUser();

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

            promises.getUser = customerDataservice.getUser();

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