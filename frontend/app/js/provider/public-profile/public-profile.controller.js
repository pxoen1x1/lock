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

        vm.profileData = {
            name: 'Tony Stark',
            photo: 'https://s-media-cache-ak0.pinimg.com/736x/38/fd/d2/38fdd224b7674128ae34ed9138fa730f.jpg',
            verified: 1,
            rating: 4.5,
            requestsDone: 20,
            workingHours: {
                from: '2016-08-26T10:00:00.000Z',
                to: '2016-08-26T18:00:00.000Z'
            },
            services: [
                {
                    name: 'Car',
                    price: 40
                },
                {
                    name: 'House',
                    price: 60
                }
            ]
        };

        vm.feedbackData = {
            count: 12,
            items: [
                {
                    name: 'Happy User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 4,
                    text: 'Good. Good. Good. Good. Good. Good. Good. Good. Good. Good. Good. Good. Good.'
                },
                {
                    name: 'Silent User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 4,
                    text: ''
                },
                {
                    name: 'Some User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 5,
                    text: 'Very good. Very good. Very good. Very good. Very good. Very good. Very good.'
                },
                {
                    name: 'Another User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 3,
                    text: 'Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice. Nice.'
                },
                {
                    name: 'Angry User',
                    photo: 'https://lh5.ggpht.com/-_JtelNWHlKI/AAAAAAAAAAI/AAAAAAAAAAA/ReIT2Tkc_SU/w96-c-h96/photo.jpg',
                    rate: 1,
                    text: 'Bad worker. Bad worker. Bad worker. Bad worker. Bad worker. Bad worker. Bad worker.'
                }
            ]

        };


    }
})();