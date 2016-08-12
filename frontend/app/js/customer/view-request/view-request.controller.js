(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('ViewRequestController', ViewRequestController);

    ViewRequestController.$inject = ['$state'];

    /* @ngInject */
    function ViewRequestController($state) {
        var vm = this;

    }
})();