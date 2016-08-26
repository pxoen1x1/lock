(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = [];

    /* @ngInject */
    function CustomerProfileController() {
        var vm = this;

        vm.dataSource = {
            photo: 'https://pp.vk.me/c604329/v604329073/1a33c/XhTVHpUbzGU.jpg',
            name: 'Elliot Aldrerson',
            verified: 1,
            email: 'mrrobot@fsociety.org',
            phone: '+1 (123) 456-789-10',
            card: '9000 1234 5678 9142',
            joined: {
                date: '2016-06-23',
                elapsed: '1 month 14 days'
            },
            requests: {
                total: 16,
                month: 4
            },
            spent: {
                total: 600,
                month: 200
            }
        };

        vm.isEditing = false;
        vm.updateUser = updateUser;

        function updateUser() {
            vm.isEditing = false;
        }
    }
})();