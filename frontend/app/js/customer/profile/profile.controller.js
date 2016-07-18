(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['$state', '$mdMedia'];

    /* @ngInject */
    function CustomerProfileController($state, $mdMedia) {
        var vm = this;

        vm.$mdMedia = $mdMedia;
    }
})();