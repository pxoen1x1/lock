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
            name: 'Tony Stark',
            photo: 'https://s-media-cache-ak0.pinimg.com/736x/38/fd/d2/38fdd224b7674128ae34ed9138fa730f.jpg',
            verified: 1,
            rating: 4.5
        };
        
    }
})();