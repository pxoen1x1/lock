(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestChatController', CustomerRequestChatController);

    CustomerRequestChatController.$inject = ['$state'];

    /* @ngInject */
    function CustomerRequestChatController($state) {
        var vm = this;

    }
})();