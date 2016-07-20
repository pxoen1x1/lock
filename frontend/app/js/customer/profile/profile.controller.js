(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['$state', '$mdMedia'];

    /* @ngInject */
    function CustomerProfileController($state, $mdMedia) {
        var vm = this;

        vm.dataSource = {
            photo: "https://pp.vk.me/c604329/v604329073/1a33c/XhTVHpUbzGU.jpg",
            name: "Elliot Aldrerson",
            verified: 1,
            email: "mrrobot@fsociety.org",
            phone: "+1 (123) 456-789-10",
            card: "9142",
            join: {
                date: "24 February 2016",
                elapsed: "4 month 23 days"
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

        vm.$mdMedia = $mdMedia;
    }
})();