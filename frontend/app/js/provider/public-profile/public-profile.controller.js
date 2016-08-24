(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderPublicProfileController', ProviderPublicProfileController);

    ProviderPublicProfileController.$inject = ['$stateParams'];

    /* @ngInject */
    function ProviderPublicProfileController($stateParams) {
        var vm = this;

        vm.profileId = $stateParams.profileId;

        vm.dataSource = {
        };
        
    }
})();