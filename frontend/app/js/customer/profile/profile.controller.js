(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = [];

    /* @ngInject */
    function CustomerProfileController() {
        var vm = this;

        vm.profileData = {
            photo: 'https://pp.vk.me/c604329/v604329073/1a33c/XhTVHpUbzGU.jpg',
            name: 'Elliot Aldrerson',
            verified: 1,
            email: 'mrrobot@fsociety.org',
            phone: '+1 (123) 456-789-10',
            card: '9000 1234 5678 9142',
            requests: 8,
            spent: 400
        };

        vm.isEditing = false;
        vm.updateUser = updateUser;

        function updateUser() {
            vm.isEditing = false;
        }
    }
})();