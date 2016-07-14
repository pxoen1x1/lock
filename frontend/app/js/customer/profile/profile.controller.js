(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = ['$state'];

    /* @ngInject */
    function CustomerProfileController($state) {
        var vm = this;
 
    }
})();