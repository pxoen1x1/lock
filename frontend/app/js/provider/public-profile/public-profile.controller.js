(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderPublicProfileController', ProviderPublicProfileController);

    ProviderPublicProfileController.$inject = ['$stateParams', 'coreDataservice', 'conf'];

    /* @ngInject */
    function ProviderPublicProfileController($stateParams, coreDataservice, conf) {
        var vm = this;

        vm.profileId = $stateParams.profileId;

        vm.profileData = {};

        vm.feedbackData = {
            count: 12,
            items: [
                {
                    id: 1,
                    name: 'Happy User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 4,
                    text: 'Good. Good. Good. Good. Good. Good. Good. Good. Good. Good. Good. Good. Good.'
                },
                {
                    id: 2,
                    name: 'Silent User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 4,
                    text: ''
                },
                {
                    id: 3,
                    name: 'Some User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 5,
                    text: 'Very good. Very good. Very good. Very good. Very good. Very good. Very good.'
                },
                {
                    id: 4,
                    name: 'Another User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 3,
                    text: 'Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice.'
                },
                {
                    id: 5,
                    name: 'Angry User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 1,
                    text: 'Bad worker. Bad worker. Bad worker. Bad worker. Bad worker. Bad worker. Bad worker.'
                }
            ]

        };

        vm.getUser = getUser;

        activate();

        function getUser() {

            return coreDataservice.getUser(vm.profileId)
                .then(function (response) {
                    var user = response.data.user;

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return vm.profileData;
                });
        }

        function activate() {
            getUser();
        }

    }
})();